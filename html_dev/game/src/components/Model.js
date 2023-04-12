// import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { MD2Loader } from './MD2Loader.js';
import { Mesh, TextureLoader, MeshPhongMaterial } from "three"
import TextureSpider from "../models/spider/Spider.png"
import TextureUnit from "../models/unit/unit02.png"
import config from "./Config"

export default class Model {
    constructor(scene, manager) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null
    }

    load(path, type, callback) {
        let texture
        if (type == "enemy") {
            texture = TextureUnit
        } else if (type == "player") {
            texture = TextureSpider
        }

        // Manager is passed in to loader to determine when loading done in main
        // Load model with FBXLoader

        new MD2Loader(this.manager).load(
            path,
            geometry => {

                this.geometry = geometry;

                // console.log('asdsadugsadogbs')


                this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                    map: new TextureLoader().load(texture), // dowolny plik png, jpg
                    morphTargets: true // animowanie materiału modelu
                }))
                this.mesh.castShadow = document.getElementById('shadows').checked
                this.mesh.receiveShadow = document.getElementById('shadows').checked
                if (type == "enemy") {
                    config.levelItems.enemies.push(this.mesh)
                } else if (type == "player") {
                    config.levelItems.player.push(this.mesh)
                }

                // this.scene.add(this.mesh);

                console.log(this.geometry.animations) // tu powinny być widoczne animacje
                callback()
            }
        );

    }

    getModel() {
        return this.mesh
    }

    makeGray() {
        function changeMaterial(node) {
            try {
                let temp_mat = node.material.clone() // trzeba zrobić shallow clone'a, bo inaczej zmienią się wszystkie obiekty
                temp_mat.color.setHex(0x80999999) // zmienia kolor
                temp_mat.map = null; // usuwa teksture
                temp_mat.needsUpdate = true; // potrzebne do usunięcia tekstury, bo bez tego nie wczyta ponownie tych wartości pustych
                node.material = temp_mat // ustawia material na temp_material
                // console.log(node.material)
            } catch (err) { }
            if (node.children) {
                for (let child of node.children) {
                    changeMaterial(child);
                }
            }
        }

        changeMaterial(this.mesh);
    }

    // unload() {
    //     this.scene.remove(this.mesh); // ew funkcja do usunięcia modelu ze sceny
    // }


}