package com.example.greenhouse.ui.plants

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.greenhouse.R

class PlantAdapter : RecyclerView.Adapter<PlantAdapter.ViewHolder>() {

    private val plants = arrayOf("Paquerette","Basilic","Thym")


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.card_layout, parent, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        //val current = plants[position]
        holder.item_plant_name.text = plants[position]
    }

    override fun getItemCount(): Int {
        return plants.size
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var item_plant_name: TextView = itemView.findViewById(R.id.textPlant)

    }
}