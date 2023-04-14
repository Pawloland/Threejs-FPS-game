package sparkserver

// import spark.kotlin.get
// import spark.kotlin.*
import com.google.gson.Gson
import spark.Spark.*
import java.sql.DriverManager

// import spark.kotlin.post

fun main() {
    /**
     *  obsługa httpservera na porcie 5000
     *  */

    val levelService = LevelService()
    port(5000)

    staticFileLocation("/public")

    get("/favicon.ico") { _, res ->
        res.type("image/png")
        res.redirect("/game_page/favicon.png")
    }

    get("/") { _, res ->
        res.type("text/html")
        res.redirect("/main_page/index.html")
    }

    get("/game") { _, res ->
        res.type("text/html")
        res.redirect("/game_page/index.html")
    }
    get("/editor") { _, res ->
        res.type("text/html")
        res.redirect("/editor_page/index.html")
    }

    post("/add") { req, _ ->

        println(req.body())
        val levels: Array<LevelItem> = Gson().fromJson(req.body(), Array<LevelItem>::class.java )?: arrayOf<LevelItem>()
        levelService.setLevel(Level(10, mutableListOf(*levels))) // js [...ssad] = *ssad kotlin
        "ok"

    } // dodanie danych levelu

    options("/*") { req, res ->
        val accessControlRequestHeaders = req
            .headers("Access-Control-Request-Headers")
        if (accessControlRequestHeaders != null) {
            res.header(
                "Access-Control-Allow-Headers",
                accessControlRequestHeaders
            )
        }
        val accessControlRequestMethod = req
            .headers("Access-Control-Request-Method")
        if (accessControlRequestMethod != null) {
            res.header(
                "Access-Control-Allow-Methods",
                accessControlRequestMethod
            )
        }
        "OK"
    }

    before({ _, res -> res.header("Access-Control-Allow-Origin", "*") })

    post("/insertToDatabase") { req, _ ->
        try {

        val conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/fps", "postgres", "postgres")
        println(req.body())

        val data: Data = Gson().fromJson(req.body(), Data::class.java)
        val stmt = conn.prepareStatement("INSERT INTO data (left_ammo, left_hearts) VALUES(?, ?) RETURNING id")
        stmt.setInt(1, data.left_ammo)
        stmt.setInt(2, data.left_hearts)
        val query = stmt.executeQuery()
        conn.close()
        "ok"
        }
        catch (e: Exception) {
            println(e)
            "database error"
        }

    } // dodanie jakichś danych do postgresa

    get("/load") { _, res ->
        res.type("application/json")
        println(Gson().toJson(levelService.getItems()))
        Gson().toJson(levelService.getItems())
//        """
//            [
//                {
//                    "id": "00",
//                    "x": 0,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "01",
//                    "x": 0,
//                    "y": 0,
//                    "z": 1,
//                    "type": "wall"
//                },
//                {
//                    "id": "02",
//                    "x": 0,
//                    "y": 0,
//                    "z": 2,
//                    "type": "wall"
//                },
//                {
//                    "id": "03",
//                    "x": 0,
//                    "y": 0,
//                    "z": 3,
//                    "type": "wall"
//                },
//                {
//                    "id": "04",
//                    "x": 0,
//                    "y": 0,
//                    "z": 4,
//                    "type": "wall"
//                },
//                {
//                    "id": "05",
//                    "x": 0,
//                    "y": 0,
//                    "z": 5,
//                    "type": "wall"
//                },
//                {
//                    "id": "06",
//                    "x": 0,
//                    "y": 0,
//                    "z": 6,
//                    "type": "wall"
//                },
//                {
//                    "id": "07",
//                    "x": 0,
//                    "y": 0,
//                    "z": 7,
//                    "type": "wall"
//                },
//                {
//                    "id": "08",
//                    "x": 0,
//                    "y": 0,
//                    "z": 8,
//                    "type": "wall"
//                },
//                {
//                    "id": "09",
//                    "x": 0,
//                    "y": 0,
//                    "z": 9,
//                    "type": "wall"
//                },
//                {
//                    "id": "10",
//                    "x": 1,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "11",
//                    "x": 1,
//                    "y": 0,
//                    "z": 1,
//                    "type": "light"
//                },
//                {
//                    "id": "14",
//                    "x": 1,
//                    "y": 0,
//                    "z": 4,
//                    "type": "light"
//                },
//                {
//                    "id": "15",
//                    "x": 1,
//                    "y": 0,
//                    "z": 5,
//                    "type": "treasure"
//                },
//                {
//                    "id": "16",
//                    "x": 1,
//                    "y": 0,
//                    "z": 6,
//                    "type": "light"
//                },
//                {
//                    "id": "17",
//                    "x": 1,
//                    "y": 0,
//                    "z": 7,
//                    "type": "treasure"
//                },
//                {
//                    "id": "19",
//                    "x": 1,
//                    "y": 0,
//                    "z": 9,
//                    "type": "light"
//                },
//                {
//                    "id": "20",
//                    "x": 2,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "24",
//                    "x": 2,
//                    "y": 0,
//                    "z": 4,
//                    "type": "enemy"
//                },
//                {
//                    "id": "26",
//                    "x": 2,
//                    "y": 0,
//                    "z": 6,
//                    "type": "enemy"
//                },
//                {
//                    "id": "30",
//                    "x": 3,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "31",
//                    "x": 3,
//                    "y": 0,
//                    "z": 1,
//                    "type": "treasure"
//                },
//                {
//                    "id": "33",
//                    "x": 3,
//                    "y": 0,
//                    "z": 3,
//                    "type": "light"
//                },
//                {
//                    "id": "37",
//                    "x": 3,
//                    "y": 0,
//                    "z": 7,
//                    "type": "light"
//                },
//                {
//                    "id": "40",
//                    "x": 4,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "41",
//                    "x": 4,
//                    "y": 0,
//                    "z": 1,
//                    "type": "light"
//                },
//                {
//                    "id": "42",
//                    "x": 4,
//                    "y": 0,
//                    "z": 2,
//                    "type": "enemy"
//                },
//                {
//                    "id": "49",
//                    "x": 4,
//                    "y": 0,
//                    "z": 9,
//                    "type": "wall"
//                },
//                {
//                    "id": "50",
//                    "x": 5,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "51",
//                    "x": 5,
//                    "y": 0,
//                    "z": 1,
//                    "type": "treasure"
//                },
//                {
//                    "id": "55",
//                    "x": 5,
//                    "y": 0,
//                    "z": 5,
//                    "type": "light"
//                },
//                {
//                    "id": "60",
//                    "x": 6,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "61",
//                    "x": 6,
//                    "y": 0,
//                    "z": 1,
//                    "type": "light"
//                },
//                {
//                    "id": "62",
//                    "x": 6,
//                    "y": 0,
//                    "z": 2,
//                    "type": "enemy"
//                },
//                {
//                    "id": "69",
//                    "x": 6,
//                    "y": 0,
//                    "z": 9,
//                    "type": "light"
//                },
//                {
//                    "id": "70",
//                    "x": 7,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "73",
//                    "x": 7,
//                    "y": 0,
//                    "z": 3,
//                    "type": "light"
//                },
//                {
//                    "id": "77",
//                    "x": 7,
//                    "y": 0,
//                    "z": 7,
//                    "type": "light"
//                },
//                {
//                    "id": "80",
//                    "x": 8,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "90",
//                    "x": 9,
//                    "y": 0,
//                    "z": 0,
//                    "type": "wall"
//                },
//                {
//                    "id": "91",
//                    "x": 9,
//                    "y": 0,
//                    "z": 1,
//                    "type": "light"
//                },
//                {
//                    "id": "94",
//                    "x": 9,
//                    "y": 0,
//                    "z": 4,
//                    "type": "wall"
//                },
//                {
//                    "id": "97",
//                    "x": 9,
//                    "y": 0,
//                    "z": 7,
//                    "type": "light"
//                },
//                {
//                    "id": "99",
//                    "x": 9,
//                    "y": 0,
//                    "z": 9,
//                    "type": "wall"
//                }
//            ]
//        """.trimIndent()

    } // pobranie danych levelu


    /**
     * manualny start sparka, poprzednio start wymuszał dowolny get,
     * ładuje się strona index.html
     */

    init()
    println("SparkServer startuje na porcie:5000")

}
