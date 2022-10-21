package com.example.greenhouse.ui.plants

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class PlantsViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is gallery  "
    }
    val text: LiveData<String> = _text
}