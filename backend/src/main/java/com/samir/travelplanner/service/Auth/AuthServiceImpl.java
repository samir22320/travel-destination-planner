package com.samir.travelplanner.service.Auth;
import com.samir.travelplanner.dto.AuthLoginRequest;
import com.samir.travelplanner.dto.AuthRegisterRequest;
import com.samir.travelplanner.dto.AuthRegisterResponse;
import com.samir.travelplanner.dto.AuthTokenResponse;
import com.samir.travelplanner.entity.User;
import com.samir.travelplanner.exception.DuplicateResourceException;
import com.samir.travelplanner.exception.ResourceNotFoundException;
import com.samir.travelplanner.mapper.UserMapper;
import com.samir.travelplanner.repository.UserRepository;
import com.samir.travelplanner.service.Jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public final UserRepository userRepository;
    public final UserMapper userMapper;
    public final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    public AuthRegisterResponse register(AuthRegisterRequest request) {
        userRepository.findByUsername(request.getUsername())
                .ifPresent(w ->
                {throw new DuplicateResourceException("UserName is already registered before");});
        User user =userMapper.toEntity(request);
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public AuthTokenResponse verify(AuthLoginRequest request) {

        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        if(!authenticate.isAuthenticated())
            throw new RuntimeException("Invalid credentials");
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthTokenResponse(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user)
        );
    }

    @Override
    public AuthTokenResponse refreshToken(String refreshToken) {
        if (jwtService.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }
        String username = jwtService.extractUserName(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(user);

        return new AuthTokenResponse(
                newAccessToken,
                refreshToken
        );
    }


}
