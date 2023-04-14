// let terrain = require('../img/terrain.jpg')
import terrain from '../img/terrain.jpg'
import config from "./Config"
import * as THREE from 'three';
// import wall from '../img/wall.jpg';

export default class Grid {
    constructor(size = 1024, divisions = 10, center_color = 0x888888, grid_color = 0xdddddd, background_color = 0x01334A, background_opacity = 0.5) { // wartości domyślne
        // powinna być utworzona w osobnym pliku Grid.js, zawierającym klasę Grid{ },
        // w klasie tylko konstruktor z materiałem, geometrią PlaneGeometry, meshem
        // oraz funkcja zwracająca tego mesha
        // materiał dla plane'a musi mieć właściwość wireframe: true

        // idk, ale chyba lepiej użyć gotowca grid

        // const geometry_surface = new THREE.PlaneGeometry(1024, 1024); // width, height, widthSegments, heightSegments 
        // geometry_surface.rotateX(-Math.PI * 0.5); // ustawia poziomo plane, poprzez obrót układu współżędnych o 90 stopni


        // const material_surface = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: texture_surface });
        // const plane = new THREE.Mesh(geometry_surface, material_surface);
        // plane.position.set(0, -0.1, 0)
        // plane.receiveShadow = true
        // scene.add(plane);

        this.size = size;
        this.divisions = divisions;
        this.center_color = center_color;
        this.grid_color = grid_color;
        this.background_color = background_color
        this.background_opacity = background_opacity

        this.gridHelper = new THREE.GridHelper(this.size, this.divisions, this.center_color, this.grid_color);
        this.gridHelper.position.y = (0.1) // żeby było widać axis'y sceny

        this.geometry_surface = new THREE.PlaneGeometry(this.size, this.size); // width, height, widthSegments, heightSegments
        this.geometry_surface.rotateX(-Math.PI * 0.5); // ustawia poziomo plane, poprzez obrót układu współżędnych o 90 stopni

        // this.texture_surface = new THREE.TextureLoader().load(terrain.default)
        this.texture_surface = new THREE.TextureLoader().load(terrain)

        // this.texture_surface = new THREE.TextureLoader().load('https://i.pinimg.com/originals/82/61/b9/8261b9e64d7cf547c0bf3878a625b955.jpg')
        // this.texture_surface = new THREE.TextureLoader().load('/img/surface_texture.png')
        this.texture_surface.wrapS = THREE.RepeatWrapping;
        this.texture_surface.wrapT = THREE.RepeatWrapping;
        this.texture_surface.minFilter = THREE.NearestFilter
        this.texture_surface.magFilter = THREE.NearestFilter
        this.texture_surface.repeat.set(this.divisions, this.divisions);

        // this.material_surface = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: this.texture_surface });
        this.material_surface = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.FrontSide, map: this.texture_surface });
        // this.material_surface = new THREE.MeshPhongMaterial({});
        this.plane = new THREE.Mesh(this.geometry_surface, this.material_surface);
        this.plane.position.set(0, 0, 0)


        this.plane.receiveShadow = document.getElementById('shadows').checked
        this.plane.castShadow = document.getElementById('shadows').checked
        config.levelItems.planes.push(this.plane)
    }
    getSurface() {
        return this.plane
    }

}