package com.samir.travelplanner.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddDestinationRequest {

    private String countryCode;
    private String countryName;
    private String capital;
    private String region;
    private Long population;
    private String currencyCode;
    private String currencyName;
    private String flagUrl;
}