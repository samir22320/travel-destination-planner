package com.samir.travelplanner.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthRegisterResponse {
        private Long id;
        private String username;
        private String role;
    }

