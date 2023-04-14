import { Ray, Raycaster, Vector3 } from "three";
import Config from './Config'

export default class Collider {
    constructor(mesh) {
        this.mesh = mesh
        this.raycaster = new Raycaster();
    }

    checkClearenceWithinRadius(radius, x_offset) {

        // console.log('...................................................')

        this.mesh.translateX(x_offset)
        for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
            const dir = new Vector3();
            // console.log(dir)

            // console.log(this.mesh.position)
            this.mesh.getWorldDirection(dir);
            // console.log(dir)

            const axis_y = new Vector3(0, 1, 0);
            dir.applyAxisAngle(axis_y, angle);
            // console.log(dir)

            const ray = new Ray(this.mesh.position, dir);
            // console.log(ray)
            this.raycaster.ray = ray;
            // console.log(Config.levelItems.walls)

            const collisions = this.raycaster.intersectObjects(Config.levelItems.walls);

            if (collisions.length > 0) {
                // console.log(collisions)
                // console.log(collisions[0])
                if (collisions[0].distance <= radius) {
                    this.mesh.translateX(-x_offset)
                    return false
                }
            }
        }
        this.mesh.translateX(-x_offset)
        return true

    }

    getDistanceToTarget(distance, target_v) {
        const origin_v = this.mesh.position
        if (origin_v.distanceTo(target_v) <= distance) {
            return true
        } else {
            return false
        }
    }

    checkCollisionsWithinDistance(distance) {
        // for (let angle = -(Math.PI / 90); angle < Math.PI / 90; angle += 0.1) { // -2 stopnie do 2 stopnie od lewej do prawej

        // this.mesh.translateX(x_offset)
        const dir = new Vector3();
        // console.log(dir)

        // console.log(this.mesh.position)
        this.mesh.getWorldDirection(dir);
        // console.log(dir)

        let angle = 0
        const axis_y = new Vector3(0, 1, 0);
        dir.applyAxisAngle(axis_y, angle + (Math.PI / 2));
        // console.log(dir)
        // console.log(this.mesh.position)

        let height = 0
        // for (let height = -3; height <= 3; height++) {
        const ray = new Ray(new Vector3(this.mesh.position.x, this.mesh.position.y + height, this.mesh.position.z), dir);
        // console.log(ray)
        this.raycaster.ray = ray;
        // console.log(Config.levelItems.walls)

        const collisions = this.raycaster.intersectObjects(Config.levelItems.enemies);
        let collisions_within_distance = []
        for (let collision of collisions) {
            if (collision.distance <= distance) {
                collisions_within_distance.push(collision)
            }
        }

        // console.log(meshesh)

        return collisions_within_distance
    }

    chceckIfChildrenOfObject(object, children_uuid) {
        function getChildren(obj) {

        }
        getChildren(obj)
        return false
    }
}