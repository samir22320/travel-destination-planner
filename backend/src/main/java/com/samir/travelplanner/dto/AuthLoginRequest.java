package com.samir.travelplanner.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthLoginRequest {

    @NotBlank(message = "Name is required")
    private String username;

    @NotBlank(message = "password is required")
    private String password;
    @Column(nullable = false, length = 5)
    @NotBlank(message = "Role is required")
    private String role;

}