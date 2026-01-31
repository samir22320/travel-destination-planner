package com.samir.travelplanner.repository;

import com.samir.travelplanner.entity.WantToVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WantToVisitRepository extends JpaRepository<WantToVisit,Long> {
    Optional<WantToVisit> findByUserIdAndDestinationId(Long userId, Long destinationId);
    List<WantToVisit> findByUserId(Long userId);
    void deleteByDestinationId(Long destinationId);
}
