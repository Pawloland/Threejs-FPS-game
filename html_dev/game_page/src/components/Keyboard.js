import Config from "./Config";

const KEYS = {
    "left": 37,
    "a": 65,
    "up": 38,
    "w": 87,
    "right": 39,
    "d": 68,
    "down": 40,
    "s": 83,
    'space': 32,
};

export default class Keyboard {
    constructor(domElement, animation, moving_animation, static_animation, attack_animation) {

        this.domElement = domElement;
        this.animation = animation
        this.moving_animation = moving_animation
        this.static_animation = static_animation
        this.attack_animation = attack_animation

        // events
        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);


    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
            case KEYS.w:
                Config.moveForward = false;
                this.animation.stopAnim()
                if (Config.attack == true && Config.ammoEnded == false) {
                    this.animation.playAnim(this.attack_animation)
                } else {
                    this.animation.playAnim(this.static_animation)
                }
                break;
            case KEYS.left:
            case KEYS.a:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
            case KEYS.d:
                Config.rotateRight = false;
                break;
            case KEYS.down:
            case KEYS.s:
                Config.moveBackward = false;
                this.animation.stopAnim()
                if (Config.attack == true && Config.ammoEnded == false) {
                    this.animation.playAnim(this.attack_animation)
                } else {
                    this.animation.playAnim(this.static_animation)
                }
                break;
            case KEYS.space:
                Config.attack = false

                break;


        }
        // console.log('onKeyChange', event.keyCode)
    }

    onKeyDown(event) {
        document.activeElement.blur();
        console.log(event.keyCode)
        switch (event.keyCode) {
            case KEYS.up:
            case KEYS.w:
                if (Config.moveForward == false) {
                    console.log('w dół')
                    Config.moveForward = true;
                    this.animation.stopAnim()
                    this.animation.playAnim(this.moving_animation)
                }
                break;
            case KEYS.left:
            case KEYS.a:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
            case KEYS.d:
                Config.rotateRight = true;
                break;
            case KEYS.down:
            case KEYS.s:
                if (Config.moveBackward == false) {
                    console.log('w dół')
                    Config.moveBackward = true;
                    this.animation.stopAnim()
                    this.animation.playAnim(this.moving_animation)
                }
                break;
            case KEYS.space:
                Config.attack = true
                break;


        }

    }


}