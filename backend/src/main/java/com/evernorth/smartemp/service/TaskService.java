package com.evernorth.smartemp.service;

import com.evernorth.smartemp.dto.*;
import com.evernorth.smartemp.entity.*;
import com.evernorth.smartemp.exception.*;
import com.evernorth.smartemp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository repo;
    private final UserRepository users;
    private final ProjectRepository projects;
    private final EmployeeService es;
    private final NotificationService notificationService;

    public List<TaskDto.Response> listAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public List<TaskDto.Response> listByEmployee(Long id) {
        return repo.findByAssignedEmployeeId(id).stream().map(this::toResponse).toList();
    }

    public TaskDto.Response create(TaskDto.Request r) {
        Task task = repo.save(map(new Task(), r));
        if (task.getAssignedEmployee() != null) {
            notificationService.createNotification(
                    task.getAssignedEmployee(),
                    "New Task Assigned",
                    "You have been assigned to task: " + task.getTitle(),
                    "TASK"
            );
        }
        return toResponse(task);
    }

    public TaskDto.Response update(Long id, TaskDto.Request r) {
        Task t = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User previousAssignee = t.getAssignedEmployee();
        Task saved = repo.save(map(t, r));

        if (saved.getAssignedEmployee() != null &&
                (previousAssignee == null || !previousAssignee.getId().equals(saved.getAssignedEmployee().getId()))) {
            notificationService.createNotification(
                    saved.getAssignedEmployee(),
                    "Task Assigned",
                    "You have been assigned to task: " + saved.getTitle(),
                    "TASK"
            );
        }
        return toResponse(saved);
    }

    public TaskDto.Response updateStatus(Long id, TaskDto.StatusUpdateRequest r) {
        Task t = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (r.getStatus() != null) t.setStatus(r.getStatus());
        if (r.getRemarks() != null) t.setRemarks(r.getRemarks());
        Task updated = repo.save(t);

        if (updated.getAssignedEmployee() != null) {
            notificationService.createNotification(
                    updated.getAssignedEmployee(),
                    "Task Status Updated",
                    "Task '" + updated.getTitle() + "' status changed to " + updated.getStatus(),
                    "TASK"
            );
        }
        return toResponse(updated);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Task not found");
        repo.deleteById(id);
    }

    private Task map(Task t, TaskDto.Request r) {
        t.setTitle(r.getTitle());
        t.setDescription(r.getDescription());
        t.setStatus(r.getStatus());
        t.setPriority(r.getPriority());
        t.setDeadline(r.getDeadline());
        t.setRemarks(r.getRemarks());
        t.setAssignedEmployee(r.getAssignedEmployeeId() == null ? null :
                users.findById(r.getAssignedEmployeeId()).orElseThrow(() -> new ResourceNotFoundException("Employee not found")));
        t.setProject(r.getProjectId() == null ? null :
                projects.findById(r.getProjectId()).orElseThrow(() -> new ResourceNotFoundException("Project not found")));
        return t;
    }

    public TaskDto.Response toResponse(Task t) {
        return TaskDto.Response.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .priority(t.getPriority())
                .deadline(t.getDeadline())
                .remarks(t.getRemarks())
                .assignedEmployee(t.getAssignedEmployee() == null ? null : es.toSummary(t.getAssignedEmployee()))
                .project(t.getProject() == null ? null : TaskDto.ProjectRef.builder().id(t.getProject().getId()).name(t.getProject().getName()).build())
                .build();
    }
}
