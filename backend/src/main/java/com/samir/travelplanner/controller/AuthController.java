
package com.samir.travelplanner.controller;
import com.samir.travelplanner.dto.AuthLoginRequest;
import com.samir.travelplanner.dto.AuthRegisterRequest;
import com.samir.travelplanner.dto.AuthRegisterResponse;
import com.samir.travelplanner.dto.AuthTokenResponse;
import com.samir.travelplanner.service.Auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    public final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<AuthRegisterResponse> register(@Valid @RequestBody AuthRegisterRequest request)
    {
        AuthRegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokenResponse> login(@RequestBody AuthLoginRequest request)
    {
        return ResponseEntity.ok(authService.verify(request));
    }
    @PostMapping("/refresh")
    public ResponseEntity<AuthTokenResponse> refresh(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }



}
