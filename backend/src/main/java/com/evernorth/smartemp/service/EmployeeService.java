package com.evernorth.smartemp.service;

import com.evernorth.smartemp.dto.EmployeeDto;
import com.evernorth.smartemp.entity.User;
import com.evernorth.smartemp.enums.Role;
import com.evernorth.smartemp.exception.*;
import com.evernorth.smartemp.repository.NotificationRepository;
import com.evernorth.smartemp.repository.ProjectRepository;
import com.evernorth.smartemp.repository.TaskRepository;
import com.evernorth.smartemp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final UserRepository repo;
    private final PasswordEncoder enc;
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final NotificationRepository notifications;

    public Page<EmployeeDto.Response> search(String s, String d, Pageable p) {
        return repo.search(s, d, p).map(this::toResponse);
    }

    public List<EmployeeDto.Response> listAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public EmployeeDto.Response create(EmployeeDto.Request r) {
        if (repo.existsByUsername(r.getUsername()) || repo.existsByEmail(r.getEmail())) {
            throw new BadRequestException("Username or email already exists");
        }
        if (r.getPassword() == null || r.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        User u = map(new User(), r);
        u.setPassword(enc.encode(r.getPassword()));
        return toResponse(repo.save(u));
    }

    public EmployeeDto.Response update(Long id, EmployeeDto.Request r) {
        User u = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        map(u, r);
        if (r.getPassword() != null && !r.getPassword().isBlank()) {
            u.setPassword(enc.encode(r.getPassword()));
        }
        if (r.getRoles() != null) {
            u.setRoles(roles(r.getRoles()));
        }
        return toResponse(repo.save(u));
    }

    @Transactional
    public void delete(Long id) {
        if (id == 1L) {
            throw new BadRequestException("Cannot delete primary administrator");
        }
        User u = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Delete all notifications belonging to this employee
        notifications.deleteByUserId(id);

        // Unassign tasks assigned to this employee
        tasks.findByAssignedEmployeeId(id).forEach(t -> {
            t.setAssignedEmployee(null);
            tasks.save(t);
        });

        // Remove employee from all assigned projects
        projects.findAll().forEach(p -> {
            if (p.getEmployees().remove(u)) {
                projects.save(p);
            }
        });

        // Delete employee record
        repo.delete(u);
    }

    private User map(User u, EmployeeDto.Request r) {
        u.setUsername(r.getUsername());
        u.setEmail(r.getEmail());
        u.setFirstName(r.getFirstName());
        u.setLastName(r.getLastName());
        u.setDepartment(r.getDepartment());
        u.setDesignation(r.getDesignation());
        u.setSalary(r.getSalary());
        u.setPhone(r.getPhone());
        if (r.getRoles() != null) {
            u.setRoles(roles(r.getRoles()));
        }
        return u;
    }

    private Set<Role> roles(List<String> rs) {
        Set<Role> x = new HashSet<>();
        rs.forEach(s -> x.add(Role.valueOf(s.replace("ROLE_", ""))));
        return x;
    }

    public EmployeeDto.Response toResponse(User u) {
        return EmployeeDto.Response.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .department(u.getDepartment())
                .designation(u.getDesignation())
                .salary(u.getSalary())
                .phone(u.getPhone())
                .hireDate(u.getHireDate())
                .roles(u.getRoles().stream().map(Enum::name).toList())
                .build();
    }

    public EmployeeDto.Summary toSummary(User u) {
        return EmployeeDto.Summary.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .designation(u.getDesignation())
                .build();
    }

    @Transactional(readOnly = true)
    public EmployeeDto.ProfileResponse getMyProfile(String username) {
        User u = repo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        var userTasks = tasks.findByAssignedEmployeeId(u.getId());
        int assignedTaskCount = userTasks.size();
        int completedTaskCount = (int) userTasks.stream().filter(t -> t.getStatus() == com.evernorth.smartemp.enums.TaskStatus.COMPLETED).count();
        int assignedProjectCount = u.getProjects() != null ? u.getProjects().size() : 0;

        return EmployeeDto.ProfileResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .department(u.getDepartment())
                .designation(u.getDesignation())
                .salary(u.getSalary())
                .phone(u.getPhone())
                .hireDate(u.getHireDate())
                .roles(u.getRoles().stream().map(Enum::name).toList())
                .assignedTaskCount(assignedTaskCount)
                .completedTaskCount(completedTaskCount)
                .assignedProjectCount(assignedProjectCount)
                .build();
    }

    @Transactional
    public EmployeeDto.ProfileResponse updateMyProfile(String username, EmployeeDto.ProfileUpdateRequest r) {
        User u = repo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        if (r.getFirstName() != null) u.setFirstName(r.getFirstName());
        if (r.getLastName() != null) u.setLastName(r.getLastName());
        if (r.getPhone() != null) u.setPhone(r.getPhone());
        if (r.getDepartment() != null) u.setDepartment(r.getDepartment());
        if (r.getPassword() != null && !r.getPassword().isBlank()) {
            u.setPassword(enc.encode(r.getPassword()));
        }
        repo.save(u);
        return getMyProfile(username);
    }
}

