import { Sprite } from "three";

export default class Particle extends Sprite {
    constructor(material) {
        super();
        
        this.material = material.clone();
        this.scale.set(
            Math.random() * 8,
            Math.random() * 8,
            Math.random() * 8
        );
    }

    update() {
        if (this.position.y > 10) {
            this.position.x = Math.random() * 5;
            this.position.y = Math.random() * 5;
            this.position.y = Math.random() * 5;
            this.material.opacity = 1;
        }

        this.material.opacity -= 0.05;
        this.position.y += 0.4;
    }
}