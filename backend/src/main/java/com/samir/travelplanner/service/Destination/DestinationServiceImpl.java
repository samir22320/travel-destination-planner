package com.samir.travelplanner.service.Destination;

import com.samir.travelplanner.dto.AddDestinationRequest;
import com.samir.travelplanner.entity.Destination;
import com.samir.travelplanner.exception.DuplicateResourceException;
import com.samir.travelplanner.exception.ResourceNotFoundException;
import com.samir.travelplanner.mapper.DestinationMapper;
import com.samir.travelplanner.repository.DestinationRepository;
import com.samir.travelplanner.repository.WantToVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;
    private final WantToVisitRepository wantToVisitRepository;

    @Override
    public Destination addDestination(AddDestinationRequest request) {

        destinationRepository.findByCountryCode(request.getCountryCode())
                .ifPresent(d -> {
                    throw new DuplicateResourceException(
                            "Destination already exists: " + request.getCountryCode());
                });
        Destination destination = DestinationMapper.ToEntity(request);
        return destinationRepository.save(destination);
    }

    @Override
    public void deleteDestination(String countryName) {

        Destination destination=destinationRepository.findByCountryName(countryName)
                .orElseThrow(()->new ResourceNotFoundException("country name not found"));
        wantToVisitRepository.deleteByDestinationId(destination.getId());
        destinationRepository.delete(destination);
    }

    @Override
    public Long getTotalDestination() {

        return destinationRepository.count();

    }
}
