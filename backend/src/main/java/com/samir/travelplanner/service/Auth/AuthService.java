package com.samir.travelplanner.service.Auth;
import com.samir.travelplanner.dto.AuthLoginRequest;
import com.samir.travelplanner.dto.AuthRegisterRequest;
import com.samir.travelplanner.dto.AuthRegisterResponse;
import com.samir.travelplanner.dto.AuthTokenResponse;

public interface AuthService {

    AuthRegisterResponse register(AuthRegisterRequest request);

    AuthTokenResponse verify(AuthLoginRequest request);

    AuthTokenResponse refreshToken(String refreshToken);
}
