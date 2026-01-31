package com.samir.travelplanner.service.DestinationQueryService;
import com.samir.travelplanner.entity.Destination;
import com.samir.travelplanner.entity.DestinationResponse;
import com.samir.travelplanner.mapper.DestinationMapper;
import com.samir.travelplanner.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DestinationReadServiceImpl implements DestinationReadService {

    private final DestinationRepository destinationRepository;
    public Page<DestinationResponse> getApprovedDestinations(int page, int size, String search) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Destination> result;

        if (search == null || search.trim().isEmpty()) {
            result = destinationRepository.findByApprovedTrue(pageable);
        } else {
            result = destinationRepository
                    .findByApprovedTrueAndCountryNameContainingIgnoreCaseOrApprovedTrueAndRegionContainingIgnoreCase(
                            search, search, pageable
                    );
        }

        return result.map(DestinationMapper::toResponse);
    }
}
