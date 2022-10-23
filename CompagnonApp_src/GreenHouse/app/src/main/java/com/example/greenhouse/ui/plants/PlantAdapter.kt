package com.example.greenhouse.ui.plants

import android.transition.AutoTransition
import android.transition.TransitionManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
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
        holder.itemPlantImage.setImageResource(current.image)
        holder.itemPlantName.text = current.name
        holder.itemPlantPeriode.text = current.getPeriode()
        holder.itemPlantTemperature.text = current.temp.toString()
        holder.itemPlantDescription.text =current.description


        holder.itemView.setOnClickListener {
            if (holder.subItem.visibility == View.VISIBLE) {
                //TransitionManager.beginDelayedTransition(holder.cardView, AutoTransition())
                holder.subItem.visibility = View.GONE
            } else {
                TransitionManager.beginDelayedTransition(holder.cardView, AutoTransition())
                holder.subItem.visibility = View.VISIBLE
            }
        }
    }

    override fun getItemCount(): Int {
        return arrayPlants.size
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var itemPlantName: TextView = itemView.findViewById(R.id.textPlant)
        var itemPlantImage: ImageView = itemView.findViewById(R.id.imageViewPlant)
        var itemPlantTemperature : TextView = itemView.findViewById(R.id.textView_temp)
        var itemPlantPeriode : TextView = itemView.findViewById(R.id.textView_periode)
        var itemPlantDescription : TextView = itemView.findViewById(R.id.textView_description)
        var cardView : CardView = itemView.findViewById(R.id.card_plant)
        var subItem : LinearLayout = itemView.findViewById(R.id.sub_item)

    }
}