package com.samir.travelplanner.controller;
import com.samir.travelplanner.dto.AddDestinationRequest;
import com.samir.travelplanner.dto.CountrySuggestionResponse;
import com.samir.travelplanner.entity.Destination;
import com.samir.travelplanner.service.Destination.DestinationService;
import com.samir.travelplanner.service.RestCountries.RestCountriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/destinations")
@RequiredArgsConstructor
public class DestinationAdminController {

    private final RestCountriesService restCountriesService;
    private final DestinationService destinationService;

    @GetMapping("/suggestions")
    public ResponseEntity<List<CountrySuggestionResponse>> getCountrySuggestions(@RequestParam String name)
    {
        return ResponseEntity.ok(restCountriesService.searchByName(name));
    }
    @PostMapping
    public ResponseEntity<Destination> addDestination(@RequestBody AddDestinationRequest request) {
        Destination destination = destinationService.addDestination(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(destination);
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteDestination(@RequestParam String countryName)
    {
        destinationService.deleteDestination(countryName);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalDestination()
    {
        return ResponseEntity.ok(destinationService.getTotalDestination());
    }


}