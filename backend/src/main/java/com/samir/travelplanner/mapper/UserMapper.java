package com.samir.travelplanner.mapper;

import com.samir.travelplanner.dto.AuthRegisterRequest;
import com.samir.travelplanner.dto.AuthRegisterResponse;
import com.samir.travelplanner.entity.User;
import com.samir.travelplanner.exception.ResourceNotFoundException;
import com.samir.travelplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    public final UserRepository userRepository;

    public AuthRegisterResponse toResponse(User user) {
        AuthRegisterResponse response = new AuthRegisterResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        return response;
    }

    public User toEntity(AuthRegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setRole(normalizeRole(request.getRole()));
        return user;
    }
    private String normalizeRole(String role) {
        String r = role.trim().toUpperCase();
        if (!r.equals("USER") && !r.equals("ADMIN")) {
            throw new IllegalArgumentException("Role must be USER or ADMIN");
        }
        return "ROLE_" + r;
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

}
