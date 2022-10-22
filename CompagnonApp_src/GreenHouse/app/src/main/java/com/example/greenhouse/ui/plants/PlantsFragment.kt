package com.example.greenhouse.ui.plants

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.greenhouse.R
import com.example.greenhouse.databinding.FragmentPlantsBinding

class PlantsFragment : Fragment() {

    private var _binding: FragmentPlantsBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    private lateinit var adapterPlant : PlantAdapter
    private lateinit var recycler : RecyclerView


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val plantsViewModel =
            ViewModelProvider(this).get(PlantsViewModel::class.java)

        _binding = FragmentPlantsBinding.inflate(inflater, container, false)
        val root: View = binding.root

        /*val textView: TextView = binding.textGallery
        plantsViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }*/

        return root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val layoutManager = LinearLayoutManager(context)
        recycler = view.findViewById(R.id.recycler_view)
        recycler.layoutManager = layoutManager
        recycler.setHasFixedSize(true)
        adapterPlant = PlantAdapter()
        recycler.adapter = adapterPlant
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}