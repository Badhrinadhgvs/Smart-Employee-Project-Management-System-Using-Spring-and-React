package com.evernorth.smartemp.controller;

import com.evernorth.smartemp.service.EmailService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/email")
@RequiredArgsConstructor
public class TestEmailController {

    private final EmailService emailService;

    @PostMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendTestEmail(@RequestBody TestEmailRequest request) {
        String toEmail = request.getEmail();
        if (toEmail == null || toEmail.isBlank()) {
            return ResponseEntity.badRequest().body("Email address is required.");
        }

        emailService.sendNotificationEmail(
                toEmail,
                "Admin User",
                "Test Email Notification",
                "This is a test email notification sent from Smart Employee Management System. Your SMTP configuration is working correctly!",
                "SYSTEM"
        );

        return ResponseEntity.ok("Test email request queued successfully for " + toEmail);
    }

    @Data
    public static class TestEmailRequest {
        private String email;
    }
}
