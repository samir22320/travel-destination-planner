package com.samir.travelplanner.service.RestCountries;


import com.samir.travelplanner.dto.CountrySuggestionResponse;
import com.samir.travelplanner.dto.RestCountryResponse;
import com.samir.travelplanner.exception.ExternalApiException;
import com.samir.travelplanner.mapper.CountryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestCountriesServiceImpl implements RestCountriesService {

    private final WebClient webClient;

    @Override
    public List<CountrySuggestionResponse> searchByName(String name) {

        try {
            List<RestCountryResponse> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/name/{name}")
                            .queryParam(
                                    "fields",
                                    "cca2,name,capital,region,population,currencies,flags"
                            )
                            .build(name))
                    .retrieve()
                    .bodyToFlux(RestCountryResponse.class)
                    .collectList()
                    .block();

            if (response == null || response.isEmpty()) {
                throw new ExternalApiException("No countries found for name: " + name);
            }

            return response.stream()
                    .map(CountryMapper::toSuggestion)
                    .toList();

        } catch (Exception ex) {
            throw new ExternalApiException("Failed to fetch countries from external API");
        }
    }

}