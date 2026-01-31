package com.samir.travelplanner.controller;

import com.samir.travelplanner.entity.DestinationResponse;
import com.samir.travelplanner.service.WantToVisit.WantToVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/want-to-visit")
@RequiredArgsConstructor
public class WantToVisitController {

    private final WantToVisitService wantToVisitService;

    @PostMapping("/{destinationId}")
    public ResponseEntity<Void> add(@PathVariable Long destinationId){
        wantToVisitService.addToWantToVisit(destinationId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Void> remove(@PathVariable Long destinationId) {
        wantToVisitService.removeFromWantToVisit(destinationId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<List<DestinationResponse>> myList(){
        return ResponseEntity.ok(wantToVisitService.getMyWantTiVisit());
    }

}
