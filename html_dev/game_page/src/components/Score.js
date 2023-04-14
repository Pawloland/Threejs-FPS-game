import EnemySprite from "../img/enemy_sprite.png"
import HeartSprite from "../img/heart_sprite.png"
import AmmoSprite from "../img/ammo_sprite.png"
import Config from './Config'
import Database from './Database';


export default class Score {
    constructor(enemies, player) {
        this.enemies_div = document.getElementById('enemies')
        this.player_div = document.getElementById('player')

        this.enemies = enemies // lista z instancjami klasy player dla enemies-ów
        this.player = player // instancja klasy player dla playera

        this.generateEnemyHtml()
        this.generatePlayerHtml()
    }

    async attack(character) {
        // if (character.type == "enemy") { // gdy docelowy obiekt to enemy, to znaczy ze player uzywa broni
        //     this.useAmmo()
        // }

        if (character.current_heart_level - 1 > 0) {
            character.current_heart_level--
        } else {
            character.current_heart_level = character.one_heart_frame_cost
            await this.removeOneHeart(character)
        }
    }

    useAmmo() {
        if (this.player.current_ammo_level - 1 > 0) {
            this.player.current_ammo_level--
        } else {  // gdy jest 1 i szło by do 0
            this.player.current_ammo_level = this.player.one_ammo_frame_cost
            this.removeOneAmmo()
        }
    }

    async removeOneHeart(character) { // enemy albo player
        character.health_points--

        if (character.type == "player") {
            this.updatePlayerHtml()
        } else if (character.type == "enemy") {
            this.updateEnemyHtml(character)
        }

        if (character.health_points == 0) {
            if (character.type == "player") {
                await this.killPlayer()
            } else if (character.type == "enemy") {
                await this.killEnemy(character)
            }
        }
    }

    removeOneAmmo() { // dla playera
        this.player.ammo_points--
        this.updatePlayerHtml()


        if (this.player.ammo_points == 0) {
            alert('⚠ Koniec amunicji - jesteś skazany na ☠')
            Config.ammoEnded = true

        }
    }

    async killPlayer() {
        alert('Przegrałeś 😥')
        await Database.saveToDB(this.player.ammo_points, this.player.health_points)
        window.location.reload()
    }

    async killEnemy(enemy) {
        enemy.dead = true
        enemy.laser.hideLaser()
        enemy.player_model.makeGray()
        enemy.animation.stopAnim()

        if (this.enemies.every(enemy => enemy.dead == true)) {
            alert('🎉Gratulacje - wygrałeś!🎊')
            await Database.saveToDB(this.player.ammo_points, this.player.health_points)
            window.location.reload()
        }
    }

    updateEnemyHtml(enemy) {
        let enemy_hearts_span = enemy.html_score.querySelector('span.enemy_hearts')
        if (enemy.health_points > 0) {
            while (enemy_hearts_span.childElementCount > enemy.health_points) {
                enemy_hearts_span.querySelector('img.enemy_heart_img').remove()
            }
        } else {
            enemy_hearts_span.innerText = 'Nie żyje'
        }
    }

    updatePlayerHtml() {
        let player_ammo_span = document.querySelector('span.player_ammo')
        if (this.player.ammo_points > 0) {
            while (player_ammo_span.childElementCount > this.player.ammo_points) {
                player_ammo_span.querySelector('img.player_ammo_img').remove()
            }
        } else {
            player_ammo_span.innerText = 'Koniec amunicji'
        }

        let player_hearts_span = document.querySelector('span.player_hearts')
        if (this.player.health_points > 0) {
            while (player_hearts_span.childElementCount > this.player.health_points) {
                player_hearts_span.querySelector('img.player_heart_img').remove()
            }
        } else {
            player_hearts_span.innerHTML = '' // powinno być puste ale dla pewności
            player_hearts_span.innerText = 'Koniec żyć'
        }
    }

    generateEnemyHtml() {
        for (let enemy of this.enemies) {
            let enemy_span = document.createElement('span')
            enemy_span.className = 'enemy'
            let enemy_img = document.createElement('img')
            enemy_img.className = 'enemy_img'
            enemy_img.src = EnemySprite
            enemy_img.alt = 'enemy_img'

            let enemy_hearts_span = document.createElement('span')
            enemy_hearts_span.className = 'enemy_hearts'

            for (let i = 1; i <= enemy.health_points; i++) {
                let enemy_heart_img = document.createElement('img')
                enemy_heart_img.className = 'enemy_heart_img'
                enemy_heart_img.src = HeartSprite
                enemy_heart_img.alt = 'heart_img'

                enemy_hearts_span.append(enemy_heart_img)
            }
            enemy_span.append(enemy_img)
            enemy_span.append(enemy_hearts_span)
            this.enemies_div.append(enemy_span)


            enemy.html_score = enemy_span
        }
    }

    generatePlayerHtml() {
        let player_wrapper_ammo = document.createElement('div')
        player_wrapper_ammo.className = 'player_wrapper'
        let player_ammo_span = document.createElement('span')
        player_ammo_span.className = 'player_ammo'

        for (let i = 1; i <= this.player.ammo_points; i++) {
            let player_ammo_img = document.createElement('img')
            player_ammo_img.className = 'player_ammo_img'
            player_ammo_img.src = AmmoSprite
            player_ammo_img.alt = 'ammo_img'

            player_ammo_span.append(player_ammo_img)
        }

        player_wrapper_ammo.append(player_ammo_span)

        let player_wrapper_hearts = document.createElement('div')
        player_wrapper_hearts.className = 'player_wrapper'
        let player_hearts_span = document.createElement('span')
        player_hearts_span.className = 'player_hearts'

        for (let i = 1; i <= this.player.health_points; i++) {
            let player_heart_img = document.createElement('img')
            player_heart_img.className = 'player_heart_img'
            player_heart_img.src = HeartSprite
            player_heart_img.alt = 'heart_img'

            player_hearts_span.append(player_heart_img)
        }
        player_wrapper_hearts.append(player_hearts_span)

        this.player_div.append(player_wrapper_ammo)
        this.player_div.append(player_wrapper_hearts)
    }
}