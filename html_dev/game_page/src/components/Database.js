export default class Database {

    static async saveToDB(left_ammo, left_hearts) {
        const response = await fetch('http://localhost:5000/insertToDatabase', {
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
        const response = await fetch('http://localhost:5000/load', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        return (await response.json())
    }
}