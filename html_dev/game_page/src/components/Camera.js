import { PerspectiveCamera } from 'three';

export default class Camera {
    constructor(renderer, player) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;
        this.player = player

        this.threeCamera = new PerspectiveCamera(75, width / height, 0.1, 10000);
        this.threeCamera.position.set(2, 100, 2);
        // this.threeCamera.lookAt(new Vector3(0, 0, 0))
        // this.threeCamera.target.position.copy(player);
        // console.log(this.player.position)
        this.threeCamera.lookAt(this.player.position)
        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {

        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }
}