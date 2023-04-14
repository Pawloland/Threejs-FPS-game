export default class Database {
    constructor() { }

    static async saveLevelToDB(obj) {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        console.log(response);
        return response
    }

    static async getLevel() {
        const response = await fetch('/load', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        return (await response.json())
    }
}