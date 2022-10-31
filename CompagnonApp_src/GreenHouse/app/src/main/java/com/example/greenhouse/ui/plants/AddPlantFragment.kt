package com.example.greenhouse.ui.plants

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.AdapterView.OnItemClickListener
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.ListView
import androidx.fragment.app.Fragment
import com.example.greenhouse.R
import com.example.greenhouse.databinding.FragmentAddPlantBinding


class AddPlantFragment : Fragment() {

    private var _binding: FragmentAddPlantBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    private lateinit var mSearch : EditText

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        _binding = FragmentAddPlantBinding.inflate(inflater, container, false)
        val root: View = binding.root

        mSearch = root.findViewById(R.id.edit_text)
        val mListView = root.findViewById<ListView>(R.id.list_view)

        // Declare array of elements, create an adapter
        // and display the array in the ListView
        val mCities = listOf("Mumbai", "Mohali", "Delhi", "Dehradun", "Darjeeling", "Bengaluru")
        val mArrayAdapter = ArrayAdapter(requireActivity(), R.layout.list_item, R.id.text_list_item , mCities)
        mListView.adapter = mArrayAdapter

        // TextWatcher to check if the EditText text changes
        mSearch.addTextChangedListener(object: TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Do Nothing
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                mArrayAdapter.filter.filter(s)
            }

            override fun afterTextChanged(s: Editable?) {
                // Do Nothing
            }

        })

 //       return inflater.inflate(R.layout.fragment_add_plant, container, false)

        //mListView.onItemClickListener = AdapterView.OnItemClickListener{mArrayAdapter, root, }

    }



}