import config from "./Config"

export default class InputControlls {
    constructor(camera) {

        this.data = {
            camera_height: document.getElementById('camera_height').value,
            camera_tilt: document.getElementById('camera_tilt').value,
            camera_distance: document.getElementById('camera_distance').value,

            camera_swivel: document.getElementById('camera_swivel').value,
            // camera_fov: document.getElementById('camera_fov').value,
            // lights_intensity: document.getElementById('lights_intensity').value,

            // shadows: document.getElementById('shadows').checked,
            top_view: document.getElementById('top_view').checked,
            camera_following_player: document.getElementById('camera_following_player').checked,

            fire_height_y: document.getElementById('fire_height_y').value,
            fire_width_x: document.getElementById('fire_width_x').value,
            // fire_depth_z: document.getElementById('fire_depth_z').value,

        }

        this.camera = camera

        document.getElementById('camera_height').oninput = (e) => {
            console.log(e.target.value)
            this.data.camera_height = e.target.value
        }

        document.getElementById('camera_tilt').oninput = (e) => {
            console.log(e.target.value)
            this.data.camera_tilt = e.target.value
        }

        document.getElementById('camera_distance').oninput = (e) => {
            console.log(e.target.value)
            this.data.camera_distance = e.target.value
        }

        document.getElementById('camera_swivel').oninput = (e) => {
            console.log(e.target.value)
            this.data.camera_swivel = e.target.value
        }

        document.getElementById('camera_fov').oninput = (e) => {
            console.log(e.target.value)
            this.camera.fov = e.target.value;
            this.camera.updateProjectionMatrix();
            console.log('fov: ' + this.camera.fov)
        }

        document.getElementById('lights_intensity').oninput = (e) => {
            // console.log(e.target.value)
            for (let light of config.levelItems.lights) {
                light.intensity = e.target.value
            }
        }

        document.getElementById('shadows').oninput = (e) => {
            console.log(e.target.checked)

            for (let [key, value] of Object.entries(config.levelItems)) {
                console.log(key, value)
                for (let item of value) {
                    item.castShadow = e.target.checked
                    if (key != 'light') {
                        item.receiveShadow = e.target.checked
                    }
                }
            }
        }

        document.getElementById('top_view').oninput = (e) => {
            console.log(e.target.checked)
            this.data.top_view = e.target.checked
        }

        document.getElementById('camera_following_player').oninput = (e) => {
            console.log(e.target.checked)
            this.data.camera_following_player = e.target.checked
        }





        document.getElementById('fire_height_y').oninput = (e) => {
            // console.log(e.target.value)
            // this.data.fire_height_y = e.target.value
            for (let fire of config.levelItems.fires) {
                fire.scale.y = e.target.value
            }
        }

        document.getElementById('fire_width_x').oninput = (e) => {
            // console.log(e.target.value)
            // this.data.fire_width_x = e.target.value
            for (let fire of config.levelItems.fires) {
                fire.scale.x = e.target.value
            }
        }

        // document.getElementById('fire_depth_z').oninput = (e) => {
        //     console.log(e.target.value)
        //     // this.data.fire_depth_z = e.target.value
        //     for (let fire of config.levelItems.fires) {
        //         fire.scale.z = e.target.value
        //     }
        // }
    }
}