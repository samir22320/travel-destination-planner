package com.samir.travelplanner.entity;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class DestinationResponse {
    private Long id;
    private String countryCode;
    private String countryName;
    private String capital;
    private String region;
    private Long population;
    private String currencyCode;
    private String currencyName;
    private String flagUrl;
}
