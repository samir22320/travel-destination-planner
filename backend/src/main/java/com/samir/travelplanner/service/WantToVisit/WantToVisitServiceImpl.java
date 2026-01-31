package com.samir.travelplanner.service.WantToVisit;

import com.samir.travelplanner.entity.Destination;
import com.samir.travelplanner.entity.DestinationResponse;
import com.samir.travelplanner.entity.User;
import com.samir.travelplanner.entity.WantToVisit;
import com.samir.travelplanner.exception.DuplicateResourceException;
import com.samir.travelplanner.exception.ResourceNotFoundException;
import com.samir.travelplanner.mapper.DestinationMapper;
import com.samir.travelplanner.mapper.UserMapper;
import com.samir.travelplanner.repository.DestinationRepository;
import com.samir.travelplanner.repository.WantToVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WantToVisitServiceImpl implements WantToVisitService
{
    private final UserMapper userMapper;
    private final WantToVisitRepository wantToVisitRepository;
    private final DestinationRepository destinationRepository;
    @Override
    public void addToWantToVisit(Long destinationId) {
        User user = userMapper.getCurrentUser();
        wantToVisitRepository.findByUserIdAndDestinationId(user.getId(),destinationId)
                .ifPresent(
                        w -> {throw new DuplicateResourceException("Already added to want to visit");
                        });
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(()->new ResourceNotFoundException("Destination not found"));
        WantToVisit wantToVisit = WantToVisit.builder()
                .user(user)
                .destination(destination)
                .build();
        wantToVisitRepository.save(wantToVisit);
    }


    @Override
    public void removeFromWantToVisit(Long destinationId) {

        User user = userMapper.getCurrentUser();
        WantToVisit existing = wantToVisitRepository.findByUserIdAndDestinationId(user.getId(), destinationId)
                        .orElseThrow(()-> new ResourceNotFoundException("Destination not in your list"));
        wantToVisitRepository.delete(existing);
    }


    @Override
    public List<DestinationResponse> getMyWantTiVisit() {
        User user =userMapper.getCurrentUser();
        return wantToVisitRepository.findByUserId(user.getId())
                .stream()
                .map(w -> DestinationMapper.toResponse(w.getDestination()))
                .toList();
    }

    @Override
    public Long getAllWishList() {
        return wantToVisitRepository.count();
    }

}
