import * as THREE from 'three';
import config from './Config'

export default class Light {

    constructor(color, x, y, z, target) {

        // przykładowe, nieobowiązkowe parametry konstruktora
        // przekazane podczas tworzenia obiektu klasy Light
        // np scena, kolor światła, wielkość bryły

        this.color = color;
        this.x = x
        this.y = y
        this.z = z
        this.target = target
        // console.log(this.x, this.y, this.z)

        //dodatkowe zmienne tworzone w konstruktorze
        //widoczne w dalszych funkcjach


        //pusty kontener na inne obiekty 3D

        this.container = new THREE.Object3D();

        this.container.position.set(this.x, this.y, this.z)

        //wywołanie funkcji init()

        this.init()
    }

    init() {

        // utworzenie i pozycjonowanie światła

        // this.light = new THREE.PointLight(Number(`0x${this.color}`), 1, 500, Math.PI / 2);
        this.light = new THREE.PointLight(Number(`0x${this.color}`), 1, 500, Math.PI / 10);
        this.light.position.set(0, 0, 0); // ma być w pozycji 0,0,0 kontenera - nie zmieniamy
        // this.light.target = this.target;
        this.light.shadow.bias = 0.0001
        this.light.castShadow = document.getElementById('shadows').checked
        config.levelItems.lights.push(this.light)
        // this.light.receiveShadow = true
        // dodanie światła do kontenera

        this.container.add(this.light);

        //utworzenie widzialnego elementu reprezentującego światło (mały sześcian, kula, czworościan foremny, do wyboru)

        // this.mesh = new THREE.Mesh(..........)
        this.sphere_geometry = new THREE.SphereGeometry(5, 5, 5);
        this.sphere_material = new THREE.MeshBasicMaterial({
            color: 0xffee00,
            side: THREE.DoubleSide,
            wireframe: true,
        });
        this.sphere = new THREE.Mesh(this.sphere_geometry, this.sphere_material);
        // this.sphere.position.set(0, 100, 0);
        // dodanie go do kontenera

        // this.container.add(this.sphere);


    }


    // funkcja zwracająca obiekt kontenera
    // czyli nasze światło wraz z bryłą

    getLight() {
        return this.container
    }

    changeIntensity(value) {
        this.light.intensity = value
    }

    changeHeight(value) {
        this.container.position.y = value
    }

    changeRadius(value) {
        this.container.position.x = this.container.position.x > 0 ? value : -value
        this.container.position.z = this.container.position.z > 0 ? value : -value
    }

    // przykład innej funkcji, np do zmiany koloru bryły, zmiany koloru światła, etc

    changeColor(color) {
        console.log("zmiana koloru na " + color)
        this.light.color.setHex(`0x${color}`)
    }

}