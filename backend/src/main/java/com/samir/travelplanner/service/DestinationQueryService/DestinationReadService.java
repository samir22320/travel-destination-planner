package com.samir.travelplanner.service.DestinationQueryService;

import com.samir.travelplanner.entity.DestinationResponse;
import org.springframework.data.domain.Page;

public interface DestinationReadService {
    Page<DestinationResponse> getApprovedDestinations(int page, int size,String search);
}