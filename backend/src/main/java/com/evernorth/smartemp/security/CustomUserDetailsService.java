package com.evernorth.smartemp.security;

import com.evernorth.smartemp.entity.User;
import com.evernorth.smartemp.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) { this.userRepository = userRepository; }
    @Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        if (!user.isApproved()) throw new DisabledException("Your account is waiting for administrator approval.");
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername()).password(user.getPassword())
                .authorities(user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())).collect(Collectors.toSet())).build();
    }
}
