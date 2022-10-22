package com.example.greenhouse.ui.plants

import android.os.Build
import android.transition.AutoTransition
import android.transition.TransitionManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.greenhouse.R
import com.example.greenhouse.model.PlantModel

class PlantAdapter(private val arrayPlants: ArrayList<PlantModel>) : RecyclerView.Adapter<PlantAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.card_layout, parent, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val current = arrayPlants[position]
        holder.item_plant_image.setImageResource(current.image)
        holder.item_plant_name.text = current.name
        holder.item_plant_temperature.text = current.temp.toString()
        holder.item_plant_description.text =current.description


        /*holder.itemView.setOnClickListener { v ->
            if (holder.sub_item.visibility == View.VISIBLE) {
                // The transition of the hiddenView is carried out by the TransitionManager class.
                // Here we use an object of the AutoTransition Class to create a default transition
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    TransitionManager.beginDelayedTransition(holder.cardView, AutoTransition())
                }
                holder.sub_item.visibility = View.GONE
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    TransitionManager.beginDelayedTransition(holder.cardView, AutoTransition())
                }
                holder.sub_item.visibility = View.VISIBLE
            }
        }*/
    }

    override fun getItemCount(): Int {
        return arrayPlants.size
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var item_plant_name: TextView = itemView.findViewById(R.id.textPlant)
        var item_plant_image: ImageView = itemView.findViewById(R.id.imageViewPlant)
        var item_plant_temperature : TextView = itemView.findViewById(R.id.textView_temp)
        var item_plant_periode : TextView = itemView.findViewById(R.id.textView_periode)
        var item_plant_description : TextView = itemView.findViewById(R.id.textView_description)
        var sub_item: LinearLayout = itemView.findViewById(R.id.sub_item)
        var cardView : CardView = itemView.findViewById(R.id.card_plant)

    }
}