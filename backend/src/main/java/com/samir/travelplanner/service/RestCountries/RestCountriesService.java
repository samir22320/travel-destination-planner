package com.samir.travelplanner.service.RestCountries;

import com.samir.travelplanner.dto.CountrySuggestionResponse;
import com.samir.travelplanner.dto.RestCountryResponse;

import java.util.List;

public interface RestCountriesService {


    List<CountrySuggestionResponse> searchByName(String name);
}