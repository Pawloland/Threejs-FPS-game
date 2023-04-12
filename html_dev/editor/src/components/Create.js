import Database from './Database';

export default class Create {

    constructor() {
        // właściwości klasy
        this.table = document.querySelector('table')
        this.center = document.getElementById('center')
        this.data_div = document.getElementById('data')
        this.buttons = document.getElementsByTagName('button')
        this.active_action = undefined // wybiera sie po nacisnieciu buttona
        this.active_class = undefined // wybiera sie po nacisnieciu buttona
        this.data = []
        this.generateTable()
        this.linkButtons()
        this.redrawDataDiv()
    }

    generateTable() {

        for (let z = 0; z < 10; z++) {
            let tr = document.createElement('tr')
            tr.id = `z${z}`
            for (let x = 0; x < 10; x++) {
                let td = document.createElement('td')
                td.id = `x${x}z${z}`

                td.onclick = () => {
                    console.log(td.id)
                    this.changeData(x, z)
                    switch (this.active_action) {
                        case 'wall':
                        case 'enemy':
                        case 'treasure':
                        case 'light': {
                            td.classList = [this.active_class]

                        } break

                        case 'delete': {
                            td.removeAttribute('class')

                        } break

                        default: {

                        } break
                    }
                }
                tr.append(td)
            }
            this.table.append(tr)
        }
    }

    linkButtons() {
        for (let button of this.buttons) {
            console.log(button.innerText)
            switch (button.innerText) {
                case 'zapisz level na serwerze': {
                    button.onclick = async () => {
                        this.changeAction(button.innerText)
                        await Database.saveLevelToDB(this.data)
                    }
                }
                    break
                // case 'zapisz test level na serwerze': {
                //     button.onclick = () => {
                //         this.changeAction(button.innerText)
                //         // alert(button.innerText + 'akcja')
                //     }
                // }
                //     break
                case 'wczytaj level z serwera': {
                    button.onclick = async () => {
                        this.changeAction(button.innerText)
                        this.data = await Database.getLevel()
                        console.log(this.data)

                        for (let z = 0; z < 10; z++) {
                            for (let x = 0; x < 10; x++) {
                                let td = document.getElementById(`x${x}z${z}`)
                                td.removeAttribute('class')
                            }
                            // alert(button.innerText + 'akcja')
                        }

                        for (let place of this.data) {
                            let td = document.getElementById(`x${place.x}z${place.z}`)
                            switch (place.type) {
                                case "wall":
                                    td.className = 'bg_green'
                                    break
                                case "enemy":
                                    td.className = 'bg_red'
                                    break
                                case "treasure":
                                    td.className = 'bg_blue'
                                    break
                                case "light":
                                    td.className = 'bg_yellow'
                                    break
                            }
                        }

                        this.redrawDataDiv()
                    }
                }
                    break
                case 'wall': {
                    button.onclick = () => {
                        this.active_class = 'bg_green'
                        this.changeAction(button.innerText)
                        // alert(button.innerText + 'akcja')
                    }
                }
                    break
                case 'enemy': {
                    button.onclick = () => {
                        this.active_class = 'bg_red'
                        this.changeAction(button.innerText)
                        // alert(button.innerText + 'akcja')
                    }
                }
                    break
                case 'treasure': {
                    button.onclick = () => {
                        this.active_class = 'bg_blue'
                        this.changeAction(button.innerText)
                        // alert(button.innerText + 'akcja')
                    }
                }
                    break
                case 'light': {
                    button.onclick = () => {
                        this.active_class = 'bg_yellow'
                        this.changeAction(button.innerText)
                        // alert(button.innerText + 'akcja')
                    }
                }
                    break
                case 'delete': {
                    button.onclick = () => {
                        this.changeAction(button.innerText)
                        // alert(button.innerText + 'akcja')
                    }
                }
                    break
            }
        }
    }

    changeData(x, z) {
        let previous_place_config = this.data.find(place => place.id == `${x}${z}`)
        switch (this.active_action) {
            case 'wall':
            case 'enemy':
            case 'treasure':
            case 'light': {
                if (previous_place_config == undefined) {
                    let new_place = {
                        id: `${x}${z}`,
                        x: x,
                        y: 0,
                        z: z,
                        type: this.active_action
                    }
                    this.data.push(new_place)
                } else {
                    previous_place_config.type = this.active_action
                }
                this.redrawDataDiv()
            } break
            case 'delete': {
                if (previous_place_config != undefined) {
                    this.data.splice(this.data.findIndex(place => place.id == `${x}${z}`), 1)
                    this.redrawDataDiv()
                }
            } break
            default: {
                alert("nie wybrano jeszcze akcji")
            } break
        }
        this.data
    }

    redrawDataDiv() {
        this.data_div.innerText = JSON.stringify(this.data.sort((a, b) => a.id.localeCompare(b.id)), null, 5)

    }

    changeAction(action) {
        this.active_action = action
        for (let button of this.buttons) {
            if (button.innerText != action) {
                button.classList.remove('active')
            } else {
                button.classList.add('active')
            }
        }
    }
}