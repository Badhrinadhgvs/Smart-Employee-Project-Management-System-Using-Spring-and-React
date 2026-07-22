package com.evernorth.smartemp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

public final class AuthDtos {
    private AuthDtos() {}
    @Getter @Setter @Builder public static class LoginRequest {
        @NotBlank private String username; @NotBlank private String password;
    }
    @Getter @Setter @Builder public static class LoginResponse {
        private String token; private Long id; private String username; private String firstName; private String lastName; private List<String> roles;
    }
    @Getter @Setter @Builder public static class RegisterRequest {
        @NotBlank private String username; @NotBlank private String email; @NotBlank private String password;
        private String firstName; private String lastName;
    }
}
