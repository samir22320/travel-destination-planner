package com.samir.travelplanner.service.Destination;

import com.samir.travelplanner.dto.AddDestinationRequest;
import com.samir.travelplanner.entity.Destination;

public interface DestinationService {
    Destination addDestination(AddDestinationRequest request);

    void deleteDestination(String countryName);

    Long getTotalDestination();
}
