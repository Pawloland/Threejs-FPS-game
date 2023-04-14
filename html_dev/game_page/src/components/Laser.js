import { TextureLoader, BufferGeometry, PointsMaterial, Points, AdditiveBlending, BufferAttribute, Vector3 } from 'three'
import * as THREE from 'three';
import texture from '../img/particle.png'

export default class Laser {
    constructor(start_pos, end_pos, particles_count, scene, color = 0xffffff) {
        this.start_pos = start_pos
        this.end_pos = end_pos
        this.particles_count = particles_count
        this.scene = scene
        this.color = color

        this.particles_geometry = new BufferGeometry()
        this.vertices_array = new Float32Array(this.particles_count * 3)


        this.particle_material = new PointsMaterial({
            color: this.color,
            depthWrite: false,
            transparent: true,
            opacity: 0.2,
            size: 10,
            map: new TextureLoader().load(texture),
            blending: AdditiveBlending
        })

        this.subV = this.end_pos.clone().sub(this.start_pos.clone())
        // console.log(this.subV)

        this.stepV = this.subV.clone().divideScalar(this.particles_count) // particlesCount - przewidywana ilość cząsteczek na linii a-b

        // //create a blue LineBasicMaterial
        // let material = new THREE.LineBasicMaterial({ color: 0x4444ff });
        // let points = [];
        // console.log('Start laser: ')
        // console.log(this.start_pos.clone())
        // points.push(this.start_pos.clone().add(new Vector3(0, 0, 200)));
        // points.push(this.start_pos.clone().add(new Vector3(0, 0, 200)).clone().add(new Vector3(0, 100, 0)));
        // let geometry = new THREE.BufferGeometry().setFromPoints(points);
        // let line = new THREE.Line(geometry, material);
        // this.scene.add(line);


        // console.log(this.stepV)
        for (let i = 0; i < this.particles_count * 3; i += 3) {
            // console.log('nextpoint')
            // console.log(i / 3)
            // console.log(this.start_pos.clone().multiplyScalar(i / 3))
            // console.log(this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)))

            this.vertices_array[i] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).x //x
            this.vertices_array[i + 1] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).y //y
            this.vertices_array[i + 2] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).z //z
            // console.log('**********')

        }
        // poniższa linia przypisuje geometrii naszą tablicę punktów

        this.particles_geometry.setAttribute("position", new BufferAttribute(this.vertices_array, 3))

        // z geometrii jak zawsze powstaje mesh, złożony
        // z geometrii i materiału typu Points

        this.mesh = new Points(this.particles_geometry, this.particle_material)
        // this.mesh.position.set(0, -24, 0)
        // this.scene.add(this.mesh)

    }

    showLaser() {
        this.scene.add(this.mesh)
    }

    hideLaser() {
        this.scene.remove(this.mesh)
    }

    updateSize(size) {
        this.particle_material.size = size
    }

    randomSign(nr) {
        const sign = [-1, 1]
        return nr * sign[Math.round(Math.random())]
    }

    getReadableArray(array) {
        let readable = []
        for (let i = 0; i < array.length; i += 3) {
            readable.push({
                x: array[i],
                y: array[i + 1],
                z: array[i + 2]
            })
        }
        return readable
    }

    pulse(magnitude) {
        this.frame_waiter = 0
        // this.skipped_frames = 0
        this.skipped_frames++
        this.section_length = 40
        this.max_current_offset = this.particles_count - this.section_length
        if (this.skipped_frames >= this.frame_waiter) {
            this.skipped_frames = 0
            this.speed_per_frame = 10
            if (this.current_offset + this.speed_per_frame <= this.max_current_offset) {
                this.current_offset += this.speed_per_frame
            } else {
                // alert('reset')
                this.current_offset = 0
            }

            // console.log('-------------------- Laser pulsed --------------------')
            // let positions = this.particles_geometry.attributes.position.array
            // console.log('this.vertices_array.length ' + this.vertices_array.length / 3)
            // console.log(this.getReadableArray(this.vertices_array))
            // console.log('positions.length ' + positions.length / 3)
            // console.log(this.getReadableArray(positions))
            // console.log('this.section_length: ' + this.section_length)  // długość sekcji
            // console.log('this.current_offset:' + this.current_offset) // pocz sekcji


            this.tmp_vertices_array = new Float32Array(this.section_length * 3)
            let section_end_offset = this.current_offset + this.section_length - 1

            for (let i = 0; i < this.particles_count * 3; i += 3) {
                // console.log('nextpoint')
                // console.log(i / 3)
                // console.log(this.start_pos.clone().multiplyScalar(i / 3))
                // console.log(this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)))

                // this.section_length = this.particles_count / 10 -> 200 / 10 == 20
                let offset = i / 3       //0,1,2,3,4
                // i                     //0,3,6,9  ....
                // i + 1                 //1,4,7,10 ....
                // i + 2                 //2,5,8,11 ....

                if (this.current_offset <= this.max_current_offset && (this.current_offset <= offset && offset <= section_end_offset)) {
                    // console.log("offset: " + offset) // index

                    // pierwszy warunek po to żeby nie wyjeczać poza odległość naszej tablicy z cząsteczkami
                    // drugi warunek po to żeby nie wyjkeczać poza długość sekcji

                    this.tmp_vertices_array[(offset - this.current_offset) * 3] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).x + this.randomSign(Math.random() * magnitude) //x
                    this.tmp_vertices_array[((offset - this.current_offset) * 3) + 1] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).y + this.randomSign(Math.random() * magnitude) //y
                    this.tmp_vertices_array[((offset - this.current_offset) * 3) + 2] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).z + this.randomSign(Math.random() * magnitude) //z
                    // console.log({
                    //     x: (offset - this.current_offset) * 3,
                    //     y: ((offset - this.current_offset) * 3) + 1,
                    //     z: ((offset - this.current_offset) * 3) + 2,
                    // })
                    // console.log({
                    //     x: this.tmp_vertices_array[(offset - this.current_offset) * 3],
                    //     y: this.tmp_vertices_array[((offset - this.current_offset) * 3) + 1],
                    //     z: this.tmp_vertices_array[((offset - this.current_offset) * 3) + 2]
                    // })
                }

                // this.vertices_array[i] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).x + this.randomSign(Math.random() * magnitude) //x
                // this.vertices_array[i + 1] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).y + this.randomSign(Math.random() * magnitude) //y
                // this.vertices_array[i + 2] = this.start_pos.clone().add(this.stepV.clone().multiplyScalar(i / 3)).z + this.randomSign(Math.random() * magnitude) //z
                // console.log('**********')

            }


            // console.log('section_end_offset: ' + section_end_offset) // koniec sekcji
            // console.log('this.max_current_offset: ' + this.max_current_offset) // koniec sekcji

            // console.log('this.tmp_vertices_array.length: ' + this.tmp_vertices_array.length / 3)
            // console.log(this.getReadableArray(this.tmp_vertices_array))


            this.particles_geometry.setAttribute("position", new BufferAttribute(this.tmp_vertices_array, 3))


            this.particles_geometry.attributes.position.needsUpdate = true
        }
    }

}