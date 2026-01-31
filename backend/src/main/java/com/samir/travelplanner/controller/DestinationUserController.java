package com.samir.travelplanner.controller;

import com.samir.travelplanner.entity.DestinationResponse;
import com.samir.travelplanner.repository.WantToVisitRepository;
import com.samir.travelplanner.service.DestinationQueryService.DestinationReadService;
import com.samir.travelplanner.service.WantToVisit.WantToVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/destinations")
@RequiredArgsConstructor
public class DestinationUserController {

    private final DestinationReadService destinationReadService;
    private final WantToVisitService wantToVisitService;

    @GetMapping
    public Page<DestinationResponse> listApprovedDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        return destinationReadService.getApprovedDestinations(page, size,search);
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getAllWishList()
    {
        return ResponseEntity.ok(wantToVisitService.getAllWishList());
    }
}
