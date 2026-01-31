package com.samir.travelplanner.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRegisterRequest {
    @NotBlank(message = "Name is required")
    private String username;
    @NotBlank(message = "password is required")
    @Size(min = 6,message = "Password must be at least 6 characters")
    private String password;
    @NotBlank(message = "Role is required")
    private String role; // USER / ADMIN
}
