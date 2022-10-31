package com.example.greenhouse.ui.plants

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.Navigation
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.greenhouse.R
import com.example.greenhouse.databinding.FragmentPlantsBinding
import com.example.greenhouse.model.PlantModel
import com.google.android.material.snackbar.Snackbar

class PlantsFragment : Fragment() {

    private var _binding: FragmentPlantsBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    private lateinit var adapterPlant : PlantAdapter
    private lateinit var recycler : RecyclerView
    private lateinit var  arrayPlants: ArrayList<PlantModel>


    private lateinit var imgList : Array<Int>
    private lateinit var nameList: Array<String>
    private lateinit var tempList: Array<Float>
    private lateinit var descriptionList: Array<String>
    private lateinit var periode: Array<Array<String>>

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val plantsViewModel =
            ViewModelProvider(this).get(PlantsViewModel::class.java)

        _binding = FragmentPlantsBinding.inflate(inflater, container, false)
        val root: View = binding.root


        binding.fabAddPlant.setOnClickListener { view ->

            Navigation.findNavController(view).navigate(R.id.action_nav_plants_to_addPlantFragment);
        }

        return root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initializePlants()
        val layoutManager = LinearLayoutManager(context)
        recycler = view.findViewById(R.id.recycler_view)
        recycler.layoutManager = layoutManager
        recycler.setHasFixedSize(true)
        adapterPlant = PlantAdapter(arrayPlants)
        recycler.adapter = adapterPlant
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun initializePlants(){
        arrayPlants = arrayListOf()

        imgList = arrayOf(
            R.drawable.flower,
            R.drawable.flower,
            R.drawable.flower,
            R.drawable.flower
        )

        nameList = arrayOf(
            getString(R.string.name_1),
            getString(R.string.name_2),
            getString(R.string.name_3),
            getString(R.string.name_4),
        )

        descriptionList = arrayOf(
            getString(R.string.desc_1),
            getString(R.string.desc_2),
            getString(R.string.desc_3),
            getString(R.string.desc_4),
        )

        tempList = arrayOf(
            10f, 15f, 14.5f, 16f
        )


        periode = arrayOf(
            arrayOf("Fevrier", "Juin"),
            arrayOf("Fevrier", "mai"),
            arrayOf("mars", "décembre"),
            arrayOf("Fevrier", "Juin")
        )


        for(i in imgList.indices){
            val plante = PlantModel(imgList[i],nameList[i],tempList[i],periode[i],descriptionList[i])
            println(plante)
            arrayPlants.add(plante)
        }
    }

}