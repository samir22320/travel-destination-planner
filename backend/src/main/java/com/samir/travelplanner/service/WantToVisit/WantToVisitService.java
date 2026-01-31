package com.samir.travelplanner.service.WantToVisit;

import com.samir.travelplanner.entity.DestinationResponse;

import java.util.List;

public interface WantToVisitService {
    void addToWantToVisit(Long destinationId);
    void removeFromWantToVisit(Long destinationId);
    List<DestinationResponse> getMyWantTiVisit();

    Long getAllWishList();
}
