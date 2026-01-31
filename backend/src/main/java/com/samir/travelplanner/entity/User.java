package com.samir.travelplanner.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    @NotBlank(message = "Name is required")
    private String username;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "password is required")
    private String password;

    @Column(nullable = false, length = 5)
    @NotBlank(message = "Role is required")
    private String role;


}