package com.samir.travelplanner.repository;

import com.samir.travelplanner.entity.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination,Long> {
    Optional<Destination> findByCountryCode(String countryCode);
    Optional<Destination> findByCountryName(String countryName);
    Page<Destination> findByApprovedTrue(Pageable pageable);
    Page<Destination> findByApprovedTrueAndCountryNameContainingIgnoreCaseOrApprovedTrueAndRegionContainingIgnoreCase(
            String countryName,
            String region,
            Pageable pageable
    );

}
