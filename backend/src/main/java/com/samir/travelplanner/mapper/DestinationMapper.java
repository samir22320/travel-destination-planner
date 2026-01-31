package com.samir.travelplanner.mapper;

import com.samir.travelplanner.dto.AddDestinationRequest;
import com.samir.travelplanner.entity.Destination;
import com.samir.travelplanner.entity.DestinationResponse;
import org.springframework.stereotype.Component;

@Component
public class DestinationMapper {
    public static Destination ToEntity(AddDestinationRequest request)
    {
        return Destination.builder()
                .countryCode(request.getCountryCode())
                .countryName(request.getCountryName())
                .capital(request.getCapital())
                .region(request.getRegion())
                .population(request.getPopulation())
                .currencyCode(request.getCurrencyCode())
                .currencyName(request.getCurrencyName())
                .flagUrl(request.getFlagUrl())
                .approved(true)
                .build();
    }

    public static DestinationResponse toResponse(Destination d)
    {
        return DestinationResponse.builder()
                .id(d.getId())
                .countryCode(d.getCountryCode())
                .countryName(d.getCountryName())
                .capital(d.getCapital())
                .region(d.getRegion())
                .population(d.getPopulation())
                .currencyCode(d.getCurrencyCode())
                .currencyName(d.getCurrencyName())
                .flagUrl(d.getFlagUrl())
                .build();
    }

}
