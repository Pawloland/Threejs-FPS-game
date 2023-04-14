import * as THREE from 'three';
import { LoadingManager, Vector3 } from 'three';
import Model from "./Model"
import Keyboard from "./Keyboard"
import Animation from "./Animation"
import SpiderMD2 from '../models/spider/Tris.md2'
import UnitMD2 from '../models/unit/Tris.md2'
import Collider from './Collider.js'
import Laser from './Laser'
// import Laser from './Laser — kopia.js'

export default class Player {
    constructor(scene, type, x, y, z) {


        this.type = type
        this.html_score = undefined // to uzupełnia klasa score.js i to ma lement dom ze scorem enemies'a albo playera
        if (this.type == "player") {
            this.md2_model = SpiderMD2
            this.moving_animation = 'run'
            this.static_animation = 'Stand'
            this.attack_animation = 'attack'
            this.health_points = 40
            this.ammo_points = 66
            this.one_heart_frame_cost = 20 // ilość czasu w klatkach, przez jaką musi być atakowany player, żeby stracić jedno serduszko
            this.one_ammo_frame_cost = 30 // ilość czasu w klatkach, przez jaką musi być atakowany player, żeby stracić jedno serduszko
            this.current_ammo_level = this.one_ammo_frame_cost // co uderzenie będzie siezmniejszać i jak dojdzie do 0 to straci sięjedno ammo
            this.x = 0
            this.y = 24
            this.z = 0

        } else if (this.type == "enemy") {
            this.md2_model = UnitMD2
            // this.moving_animation = '1stand'
            // this.moving_animation = '8taunt'
            this.attack_animation = '8taunt'
            // this.static_animation = '8taunt'
            this.dead = false
            this.static_animation = '1stand'
            this.health_points = 6
            this.one_heart_frame_cost = 20 // ilość czasu w klatkach, przez jaką musi być atakowany enemy, żeby stracić jedno serduszko
            this.x = x
            this.y = y
            this.z = z
            this.current_animation == this.static_animation
        }

        this.current_heart_level = this.one_heart_frame_cost // co uderzenie będzie siezmniejszać i jak dojdzie do 0 to straci sięjedno serce

        this.scene = scene

        this.container = new THREE.Object3D();




        this.container.position.set(this.x, this.y, this.z)
        // manager loadingu, pozwala monitorować progress oraz fakt zakończenia ładowania





        this.manager = new LoadingManager();

        // player_model

        this.player_model = new Model(this.scene, this.manager);

        this.collider = new Collider(this.container)

        let callback = () => {
            // console.log(this)

            this.isLoaded = true;
            //
            console.log(this.type + "_model LOADED!!!")
            this.container.add(this.player_model.getModel())

            // player_model loaded - można sterować animacjami

            this.animation = new Animation(this.player_model.getModel())

            // przykładowa animacja z modelu Mario

            this.animation.playAnim(this.static_animation)

            //kawiatura
            this.attack_activated = false
            this.attack_ended = false
            // this.player_model.getModel().add(new THREE.AxesHelper(50))
            // this.container.add(new THREE.AxesHelper(50))
            if (this.type == "player") {
                this.keyboard = new Keyboard(window, this.animation, this.moving_animation, this.static_animation, this.attack_animation);
                this.laser = new Laser(new Vector3(0, 0, 0), new Vector3(200, 0, 0), 400, this.container, 0x0000ff)
                // this.laser.updateSize(20)
            }
            if (this.type == 'enemy') {
                console.log(this.container.position)
                console.log('Start enemy: ')
                console.log(this.container.position.clone())
                this.laser = new Laser(new Vector3(0, 0, 15), new Vector3(0, -10, 100), 200, this.container, 0x00ff00)
                this.player_model.getModel().rotateY(-90)

                this.laser.mesh.position.set(0, 10, 0)
            }

        }

        this.player_model.load(this.md2_model, this.type, callback);

        // moniytor progressu ładowania

        this.manager.onProgress = (item, loaded, total) => {
            console.log(`progress ${item}: ${loaded} ${total}`);
        };


        //




        // this.geometry = new THREE.ConeGeometry(50, 100, 100);
        // this.material = new THREE.MeshBasicMaterial({
        //     color: 0xeb34e8,
        //     side: THREE.DoubleSide,
        //     wireframe: true,
        //     transparent: true,
        //     opacity: 0.5
        // });
        // this.cone = new THREE.Mesh(this.geometry, this.material);
        // this.cone.position.set(100, 0, 130)

    }

    getPlayer() {
        return this.container
    }
}