import {
    Scene,
    Clock,
    Vector3,
    LoadingManager
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// import level from './level.json'

import Renderer from './Renderer';
import Camera from './Camera';
import Grid from './Grid'
import Light from './Light'
import FirePlace from './FirePlace'
import InputControlls from './InputControlls'
// import Ico from './Ico';
import Player from './Player';
import Wall from './Wall';

// import Model from "./Model"
// import UnitMD2 from '../models/unit/Tris.md2'
// import Keyboard from "./Keyboard"
// import Animation from "./Animation"
import Config from './Config';
import Score from './Score';


export default class Main {
    constructor(container, level) {
        // właściwości klasy
        this.container = container;
        this.scene = new Scene();
        this.scene.castShadow = true
        this.scene.receiveShadow = true
        this.renderer = new Renderer(this.scene, container);

        this.isLoaded = null
        this.animation = null


        this.grid = new Grid()
        // this.light = new Light('ffffff', 0, 100, 0, this.grid.getSurface())
        this.player = new Player(this.scene, "player")
        this.scene.add(this.grid.getSurface())
        // this.scene.add(this.light.getLight())
        this.scene.add(this.player.getPlayer())
        Config.levelItems.player.push(this.player.getPlayer())
        this.camera = new Camera(this.renderer.threeRenderer, this.player.getPlayer());
        // this.ico = new Ico(this.scene);
        // console.log(this.grid.getSurface())

        // this.controls = new OrbitControls(this.camera.threeCamera, this.renderer.threeRenderer.domElement);
        //stats - statystyki wydajności

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

        document.body.appendChild(this.stats.dom);

        // zegar - vide lekcja 4

        this.clock = new Clock()



        this.walls = []
        this.lights = []
        this.firePlaces = []
        this.treasures = []
        this.enemies = []

        this.level = level

        for (let level_item of this.level) {
            // console.log(level_item)
            let translated = this.translatePosition(level_item.x, level_item.z)
            switch (level_item.type) {
                case 'wall': {
                    let wall = new Wall(translated.x, 1024 / 20, translated.z)
                    this.scene.add(wall.getWall())
                    this.walls.push(wall)
                } break
                case 'light': {
                    let light = new Light('e25822', translated.x, 10, translated.z, this.scene)
                    this.scene.add(light.getLight())
                    this.lights.push(light)

                    let fire = new FirePlace()
                    fire.position.x = translated.x
                    fire.position.y = -1;
                    fire.position.z = translated.z;
                    this.firePlaces.push(fire);
                    this.scene.add(fire);

                } break
                case 'treasure': {

                } break
                case 'enemy': {
                    let new_enemy = new Player(this.scene, "enemy", translated.x, 26, translated.z)
                    this.enemies.push(new_enemy)
                    this.scene.add(new_enemy.getPlayer())
                } break

            }
        }


        this.score = new Score(this.enemies, this.player)
        this.inputControlls = new InputControlls(this.camera.threeCamera)

        // console.log(this.renderer.threeRenderer)
        this.render();


        return (async () => {
            await this.render();
            return
        })();
    }

    translatePosition(x, z) {
        this.full_width = 1024
        this.wall_width = 1024 / 10
        this.half_wall_width = 1024 / 20
        let translated_x
        let translated_z

        if (x < 5) {
            translated_x = -(this.full_width / 2 - (x * this.wall_width + this.half_wall_width))
        } else {
            let temp_x = x - 5
            translated_x = temp_x * this.wall_width + this.half_wall_width
        }
        if (z < 5) {
            translated_z = -(this.full_width / 2 - (z * this.wall_width + this.half_wall_width))
        } else {
            let temp_z = z - 5
            translated_z = temp_z * this.wall_width + this.half_wall_width
        }
        return { x: translated_x, z: translated_z }
    }

    async render() {
        console.log("render leci")

        // początek pomiaru wydajności
        this.stats.begin()

        // delta do animacji
        var delta = this.clock.getDelta();

        // wykonanie funkcji update w module Animations - zobacz do pliku Animations
        // console.log(this.player.animation)
        if (this.player.animation) this.player.animation.update(delta)
        if (this.player.laser) {
            // this.player.laser.updateSize(document.getElementById('laser_scale').value)
            if (Config.attack == true && Config.ammoEnded == false) {
                if (this.player.laser != undefined) {
                    let collisions = this.player.collider.checkCollisionsWithinDistance(this.player.laser.end_pos.x, this.enemies)
                    // console.log('collisions')
                    // console.log(collisions)
                    let unique_meshes_uuids = []
                    if (collisions.length > 0) {
                        for (let collision of collisions) {
                            if (unique_meshes_uuids.every(unique_mesh_uuid => unique_mesh_uuid != collision.object.uuid)) {
                                // console.log('Found unique mesh:')
                                // console.log(collision)
                                unique_meshes_uuids.push(collision.object.uuid)
                            }
                        }
                    }
                    // console.log('unique_meshes_uuids')
                    // console.log(unique_meshes_uuids)
                    this.score.useAmmo()
                    for (let enemy of this.enemies) {
                        if (unique_meshes_uuids.includes(enemy.player_model.getModel().uuid) == true) { // dany enemy jest w kolizji
                            if (enemy.dead == false) {
                                await this.score.attack(enemy)
                            }
                        }
                    }
                }
                if (this.player.attack_activated == false) {
                    this.player.attack_ended = false
                    this.player.attack_activated = true
                    this.player.laser.showLaser()
                    this.player.animation.stopAnim()
                    this.player.animation.playAnim(this.player.attack_animation)
                }
            } else if (Config.attack == false && this.player.attack_ended == false) {
                this.player.attack_activated = false
                this.player.attack_ended = true
                this.player.laser.hideLaser()
                this.player.animation.stopAnim()
                if (Config.moveForward == true || Config.moveBackward == true) {
                    this.player.animation.playAnim(this.player.moving_animation)
                } else {
                    this.player.animation.playAnim(this.player.static_animation)
                }

            }
        }


        // this.firePlaces.forEach(f => f.update());
        Config.levelItems.fires.forEach(f => f.update());
        // console.log('...................................................')
        this.enemies.forEach((enemy) => {
            if (enemy.animation) enemy.animation.update(delta)
            // console.log(enemy)
            // console.log(enemy.player_model)
            if (enemy.dead == false) {
                enemy.container.lookAt(this.player.getPlayer().position)
                let collision_detected = enemy.collider.getDistanceToTarget(100, this.player.getPlayer().position)
                // console.log('enemy detected collision in radius: ' + collision_detected)
                if (enemy.player_model.getModel()) {
                    enemy.laser.updateSize(document.getElementById('laser_scale').value)
                    if (collision_detected == true) {
                        this.score.attack(this.player)
                        if (enemy.current_animation != enemy.attack_animation) {
                            enemy.current_animation = enemy.attack_animation
                            enemy.animation.stopAnim()
                            enemy.animation.playAnim(enemy.attack_animation)
                            enemy.laser.current_offset = -1 // automatucznie podniesione zostanie do 0
                            enemy.laser.skipped_frames = 0
                            enemy.laser.showLaser()

                        }
                        enemy.laser.pulse(document.getElementById('shake_magnitude').value)
                    } else {
                        if (enemy.current_animation != enemy.static_animation) {
                            enemy.current_animation = enemy.static_animation
                            enemy.animation.stopAnim()
                            enemy.animation.playAnim(enemy.static_animation)
                            enemy.laser.hideLaser()

                        }
                    }
                    // alert("Hello! I am an alert box!!");
                }
            }


        })

        // obsługa ruch modelu dopiero kiedy jest załadowany, można tą część umieścić w module Keyboard
        // tworząc w nim np funkcję update() i wywoływać ją poniżej

        if (this.player.getPlayer()) {

            // setTimeout(() => { console.log(Config) })
            //
            if (Config.rotateLeft) {
                this.player.getPlayer().rotation.y += 0.05
            }
            if (Config.rotateRight) {
                this.player.getPlayer().rotation.y -= 0.05
            }
            if (Config.moveForward && this.player.collider.checkClearenceWithinRadius(20, 3) == true) {
                this.player.getPlayer().translateX(3)
            }
            if (Config.moveBackward && this.player.collider.checkClearenceWithinRadius(20, -3) == true) {
                this.player.getPlayer().translateX(-3)
            }
            if (this.inputControlls.data.top_view == false) {
                const camVect = new Vector3(this.inputControlls.data.camera_distance, this.inputControlls.data.camera_height, 0)
                const camPos = camVect.applyMatrix4(this.player.getPlayer().matrixWorld);
                this.camera.threeCamera.position.x = camPos.x
                this.camera.threeCamera.position.y = camPos.y
                this.camera.threeCamera.position.z = camPos.z
                this.camera.threeCamera.lookAt(this.player.getPlayer().position)

                // let axis_horizont = new Vector3(1, 0, 0)

                // this.camera.threeCamera.rotateOnWorldAxis(axis_horizont, this.inputControlls.data.camera_tilt)
                this.camera.threeCamera.rotateX(this.inputControlls.data.camera_tilt)
                // this.camera.threeCamera.rotateY(this.inputControlls.data.camera_swivel)

                let axis_vertical = new Vector3(0, 1, 0)
                this.camera.threeCamera.rotateOnWorldAxis(axis_vertical, this.inputControlls.data.camera_swivel)

            } else {
                if (this.inputControlls.data.camera_following_player == false) {
                    this.camera.threeCamera.lookAt(0, 0, 0)
                    this.camera.threeCamera.position.set(0, 1000, 0);
                } else {
                    this.camera.threeCamera.lookAt(this.player.getPlayer().position)
                    this.camera.threeCamera.position.set(0, 1000, 0);
                }
            }
        }



        // koniec statystyk
        this.stats.end()

        // tu zmiany przed renderem
        // this.ico.update() // obrót ico

        ////////////

        // render nowej klatki

        // this.renderer.threeRenderer.shadowMap.enabled = this.inputControlls.data.shadows
        // console.log(this.inputControlls.data.shadows)
        // console.log(this.renderer.threeRenderer.shadowMap.enabled)

        this.renderer.render(this.scene, this.camera.threeCamera);

        requestAnimationFrame(this.render.bind(this));
    }
}