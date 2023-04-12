import { AdditiveBlending, Object3D, PointLight, SpriteMaterial, TextureLoader } from "three";
import fireTexture from "../img/particle.png";
import Particle from "./Particle";
import Config from './Config'

export default class FirePlace extends Object3D {
    constructor() {
        super();
        this.particles = [];
        this.count = 100;

        this.particleMaterial = new SpriteMaterial({
            color: 0xe25822,
            map: new TextureLoader().load(fireTexture),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: AdditiveBlending
        });

        // this.point = new PointLight(0xe25822, 20, 20);
        // this.point.castShadow = true

        for (let i = 0; i < this.count; i++) {
            const particle = new Particle(this.particleMaterial);
            this.add(particle);
            this.particles.push(particle);
        }

        // Config.levelItems.lights.push(this.point)
        Config.levelItems.fires.push(this)
        console.log(Config.levelItems.fires)
        this.scale.z = 100
    }

    update() {
        this.particles.forEach(p => {
            p.update();
        });
    }
}