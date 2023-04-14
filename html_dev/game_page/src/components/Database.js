export default class Database {

    static async saveToDB(left_ammo, left_hearts) {
        const response = await fetch('/insertToDatabase', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ left_ammo: left_ammo, left_hearts: left_hearts })
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