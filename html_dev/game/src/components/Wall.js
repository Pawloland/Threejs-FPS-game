import * as THREE from 'three';
import wall from '../img/wall.jpg'
import config from './Config'

export default class Wall {
    constructor(x, y, z) {


        this.texture_surface = new THREE.TextureLoader().load(wall)
        this.texture_surface.wrapS = THREE.RepeatWrapping;
        this.texture_surface.wrapT = THREE.RepeatWrapping;
        this.texture_surface.minFilter = THREE.NearestFilter
        this.texture_surface.magFilter = THREE.NearestFilter
        this.texture_surface.repeat.set(1, 1);


        this.geometry = new THREE.BoxGeometry(102.4, 102.4, 102.4, 1, 1, 1);

        this.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.FrontSide,
            map: this.texture_surface
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.set(x, y, z)

        this.cube.receiveShadow = document.getElementById('shadows').checked
        this.cube.castShadow = document.getElementById('shadows').checked
        config.levelItems.walls.push(this.cube)

    }

    getWall() {
        return this.cube
    }
}