package sparkserver

class LevelService {
    private lateinit var level: Level
    fun setLevel(level:Level) {
        this.level = level

    }

    fun getItems() :Array<LevelItem> {
        return if (this::level.isInitialized) level.list.toTypedArray() else arrayOf()
    }
}