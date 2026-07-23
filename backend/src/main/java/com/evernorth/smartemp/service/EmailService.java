package com.evernorth.smartemp.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.from:noreply.smartemp@gmail.com}")
    private String fromAddress;

    @Async
    public void sendNotificationEmail(String toAddress, String recipientName, String title, String message, String type) {
        if (!mailEnabled) {
            log.info("Email notifications disabled. Skipping email to: {}", toAddress);
            return;
        }

        if (toAddress == null || toAddress.isBlank()) {
            log.warn("Cannot send email notification: recipient email address is blank.");
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromAddress);
            helper.setTo(toAddress);
            helper.setSubject("SmartEmp Notification: " + title);

            String name = (recipientName != null && !recipientName.isBlank()) ? recipientName : "User";
            String category = (type != null) ? type.toUpperCase() : "GENERAL";

            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
                        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                        .header { background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px; text-align: center; }
                        .header h2 { margin: 0; font-size: 22px; font-weight: 600; }
                        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; background: #3b82f6; color: white; font-size: 11px; font-weight: bold; margin-top: 8px; text-transform: uppercase; }
                        .body { padding: 30px; color: #334155; line-height: 1.6; }
                        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
                        .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; font-size: 15px; color: #1e293b; }
                        .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="header">
                            <h2>Smart Employee Management System</h2>
                            <span class="badge">%s</span>
                        </div>
                        <div class="body">
                            <div class="greeting">Hello %s,</div>
                            <p>You have received a new notification regarding your account / tasks:</p>
                            <div class="message-box">
                                <strong>%s</strong>
                                <p style="margin: 8px 0 0 0;">%s</p>
                            </div>
                            <p>Log in to your portal dashboard to view full details.</p>
                        </div>
                        <div class="footer">
                            &copy; 2026 Smart Employee & Project Management System. All rights reserved.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(category, name, title, message);

            helper.setText(htmlBody, true);
            mailSender.send(mimeMessage);
            log.info("Successfully sent email notification to {} ({})", toAddress, title);

        } catch (Exception e) {
            log.error("Failed to send email notification to {}: {}. App execution will continue normally.", toAddress, e.getMessage(), e);
        }
    }
}
