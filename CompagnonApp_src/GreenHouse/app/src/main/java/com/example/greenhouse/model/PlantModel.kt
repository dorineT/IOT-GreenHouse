package com.example.greenhouse.model

class PlantModel(
    val image: Int,
    val name: String,
    val temp: Float,
    val periode: Array<String>,
    val description: String,
    ) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PlantModel

        if (image != other.image) return false
        if (name != other.name) return false
        if (temp != other.temp) return false
        if (!periode.contentEquals(other.periode)) return false
        if (description != other.description) return false

        return true
    }

    override fun hashCode(): Int {
        var result = image
        result = 31 * result + name.hashCode()
        result = 31 * result + temp.hashCode()
        result = 31 * result + periode.contentHashCode()
        result = 31 * result + description.hashCode()
        return result
    }


}