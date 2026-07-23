package com.evernorth.smartemp.config;

import com.evernorth.smartemp.entity.*;
import com.evernorth.smartemp.enums.*;
import com.evernorth.smartemp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() != 0) {
            userRepository.findByUsername("admin").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
            userRepository.findByUsername("john_doe").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
            userRepository.findByUsername("priya_r").ifPresent(u -> { u.setApproved(true); userRepository.save(u); });
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
    }
}
