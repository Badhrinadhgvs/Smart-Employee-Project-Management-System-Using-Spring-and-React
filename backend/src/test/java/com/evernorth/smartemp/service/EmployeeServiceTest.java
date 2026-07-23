package com.evernorth.smartemp.service;

import com.evernorth.smartemp.dto.EmployeeDto;
import com.evernorth.smartemp.entity.Notification;
import com.evernorth.smartemp.entity.Project;
import com.evernorth.smartemp.entity.Task;
import com.evernorth.smartemp.entity.User;
import com.evernorth.smartemp.enums.Role;
import com.evernorth.smartemp.exception.BadRequestException;
import com.evernorth.smartemp.exception.ResourceNotFoundException;
import com.evernorth.smartemp.repository.NotificationRepository;
import com.evernorth.smartemp.repository.ProjectRepository;
import com.evernorth.smartemp.repository.TaskRepository;
import com.evernorth.smartemp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private UserRepository repo;

    @Mock
    private PasswordEncoder enc;

    @Mock
    private ProjectRepository projects;

    @Mock
    private TaskRepository tasks;

    @Mock
    private NotificationRepository notifications;

    @InjectMocks
    private EmployeeService employeeService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(2L)
                .username("john_doe")
                .email("john@example.com")
                .password("encoded_pass")
                .firstName("John")
                .lastName("Doe")
                .department("Engineering")
                .roles(new HashSet<>(Set.of(Role.EMPLOYEE)))
                .build();
    }

    @Test
    void testDelete_PrimaryAdmin_ThrowsBadRequestException() {
        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            employeeService.delete(1L);
        });
        assertEquals("Cannot delete primary administrator", exception.getMessage());
        verifyNoInteractions(notifications, tasks, projects);
    }

    @Test
    void testDelete_EmployeeNotFound_ThrowsResourceNotFoundException() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.delete(99L);
        });
    }

    @Test
    void testDelete_Success_CleansUpDependencies() {
        when(repo.findById(2L)).thenReturn(Optional.of(sampleUser));

        Task task1 = Task.builder().id(10L).title("Task 1").assignedEmployee(sampleUser).build();
        when(tasks.findByAssignedEmployeeId(2L)).thenReturn(List.of(task1));

        Project proj1 = Project.builder().id(20L).name("Project A").employees(new HashSet<>(Set.of(sampleUser))).build();
        when(projects.findAll()).thenReturn(List.of(proj1));

        employeeService.delete(2L);

        verify(notifications, times(1)).deleteByUserId(2L);
        assertNull(task1.getAssignedEmployee());
        verify(tasks, times(1)).save(task1);
        assertFalse(proj1.getEmployees().contains(sampleUser));
        verify(projects, times(1)).save(proj1);
        verify(repo, times(1)).delete(sampleUser);
    }

    @Test
    void testCreate_DuplicateUsername_ThrowsBadRequestException() {
        EmployeeDto.Request request = EmployeeDto.Request.builder()
                .username("john_doe")
                .email("new@example.com")
                .password("password123")
                .build();

        when(repo.existsByUsername("john_doe")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> employeeService.create(request));
    }
}
