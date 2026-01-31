package com.samir.travelplanner.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CountrySuggestionResponse {

    private String countryCode;
    private String countryName;
    private String capital;
    private String region;
    private Long population;
    private String currencyCode;
    private String currencyName;
    private String flagUrl;
}