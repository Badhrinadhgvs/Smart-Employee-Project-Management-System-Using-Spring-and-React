package com.evernorth.smartemp.config;

import com.evernorth.smartemp.security.*;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration @EnableWebSecurity @EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean AuthenticationProvider authenticationProvider(UserDetailsService service, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(); provider.setUserDetailsService(service); provider.setPasswordEncoder(encoder); return provider;
    }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception { return config.getAuthenticationManager(); }
    @Bean CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration(); c.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); c.setAllowedHeaders(List.of("*")); c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**", c); return source;
    }
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider provider, JwtAuthFilter jwtFilter) throws Exception {
        http.csrf(csrf -> csrf.disable()).cors(cors -> {}).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(provider).authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/employees/me").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers(HttpMethod.GET, "/api/employees/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/projects/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/tasks/employee/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers(HttpMethod.PATCH, "/api/tasks/*/status").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/tasks/**").hasRole("ADMIN")
                .requestMatchers("/api/notifications/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
