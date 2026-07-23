package com.evernorth.smartemp.config;

import com.evernorth.smartemp.entity.*;
import com.evernorth.smartemp.enums.*;
import com.evernorth.smartemp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() != 0) {
            userRepository.findByUsername("admin").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
            userRepository.findByUsername("john_doe").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
            userRepository.findByUsername("priya_r").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
            seedNotificationsIfEmpty();
            return;
        }

        User admin = userRepository.save(User.builder().username("admin").email("admin@evernorth.com")
                .password(passwordEncoder.encode("admin123")).firstName("System").lastName("Admin")
                .department("Executive").designation("System Admin").salary(1800000D)
                .approved(true).roles(Set.of(Role.ADMIN, Role.EMPLOYEE)).build());
        User john = userRepository.save(User.builder().username("john_doe").email("john.doe@evernorth.com")
                .password(passwordEncoder.encode("john123")).firstName("John").lastName("Doe")
                .department("Engineering").designation("Senior Developer").salary(950000D)
                .roles(Set.of(Role.EMPLOYEE)).build());
        User priya = userRepository.save(User.builder().username("priya_r").email("priya.r@evernorth.com")
                .password(passwordEncoder.encode("priya123")).firstName("Priya").lastName("R")
                .department("Engineering").designation("QA Engineer").salary(820000D)
                .roles(Set.of(Role.EMPLOYEE)).build());

        Project project = projectRepository.save(Project.builder().name("Smart Portal Revamp")
                .status(ProjectStatus.IN_PROGRESS).priority(Priority.HIGH)
                .employees(Set.of(john, priya)).build());
        taskRepository.save(Task.builder().title("Implement portal features").status(TaskStatus.IN_PROGRESS)
                .priority(Priority.HIGH).assignedEmployee(john).project(project).build());
        taskRepository.save(Task.builder().title("Test portal features").status(TaskStatus.PENDING)
                .priority(Priority.MEDIUM).assignedEmployee(priya).project(project).build());

        seedNotificationsIfEmpty();
    }

    private void seedNotificationsIfEmpty() {
        if (notificationRepository.count() == 0) {
            userRepository.findByUsername("admin").ifPresent(admin -> {
                notificationRepository.save(Notification.builder()
                        .user(admin)
                        .title("Welcome Admin")
                        .message("Welcome to Smart Employee Management System!")
                        .type("SYSTEM")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusHours(2))
                        .build());
                notificationRepository.save(Notification.builder()
                        .user(admin)
                        .title("System Alert")
                        .message("New employee registration requests are pending review.")
                        .type("SYSTEM")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusHours(1))
                        .build());
            });

            userRepository.findByUsername("john_doe").ifPresent(john -> {
                notificationRepository.save(Notification.builder()
                        .user(john)
                        .title("Welcome John")
                        .message("Welcome to the platform. Check out your assigned tasks.")
                        .type("SYSTEM")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusHours(3))
                        .build());
                notificationRepository.save(Notification.builder()
                        .user(john)
                        .title("Task Assigned")
                        .message("You have been assigned to task: Implement portal features")
                        .type("TASK")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusMinutes(45))
                        .build());
            });

            userRepository.findByUsername("priya_r").ifPresent(priya -> {
                notificationRepository.save(Notification.builder()
                        .user(priya)
                        .title("Welcome Priya")
                        .message("Welcome to the team! You have 1 new task assigned.")
                        .type("SYSTEM")
                        .isRead(false)
                        .createdAt(LocalDateTime.now().minusHours(2))
                        .build());
            });
        }
    }
}
