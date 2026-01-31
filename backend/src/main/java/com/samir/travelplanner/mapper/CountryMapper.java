package com.samir.travelplanner.mapper;

import com.samir.travelplanner.dto.CountrySuggestionResponse;
import com.samir.travelplanner.dto.RestCountryResponse;


import java.util.Map;

public class CountryMapper {


    public static CountrySuggestionResponse toSuggestion(RestCountryResponse source) {

        String capital = null;
        if (source.getCapital() != null && !source.getCapital().isEmpty()) {
            capital = source.getCapital().get(0);
        }

        String currencyCode = null;
        String currencyName = null;
        if (source.getCurrencies() != null && !source.getCurrencies().isEmpty()) {
            Map.Entry<String, RestCountryResponse.Currency> entry =
                    source.getCurrencies().entrySet().iterator().next();
            currencyCode = entry.getKey();
            currencyName = entry.getValue().getName();
        }

        return CountrySuggestionResponse.builder()
                .countryCode(source.getCca2())
                .countryName(
                        source.getName() != null ? source.getName().getCommon() : null
                )
                .capital(capital)
                .region(source.getRegion())
                .population(source.getPopulation())
                .currencyCode(currencyCode)
                .currencyName(currencyName)
                .flagUrl(
                        source.getFlags() != null ? source.getFlags().getPng() : null
                )
                .build();
    }
}
