package com.evernorth.smartemp.service;

import com.evernorth.smartemp.dto.*;
import com.evernorth.smartemp.entity.*;
import com.evernorth.smartemp.enums.*;
import com.evernorth.smartemp.exception.*;
import com.evernorth.smartemp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repo;
    private final UserRepository users;
    private final EmployeeService es;

    @Transactional(readOnly = true)
    public Page<ProjectDto.Response> search(String s, ProjectStatus st, Priority p, Pageable pg) {
        return repo.search(s, st, p, pg).map(this::toResponse);
    }

    @Transactional
    public ProjectDto.Response create(ProjectDto.Request r) {
        Project p = new Project();
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setStatus(r.getStatus() == null ? ProjectStatus.NOT_STARTED : r.getStatus());
        p.setPriority(r.getPriority() == null ? Priority.MEDIUM : r.getPriority());
        p.setStartDate(r.getStartDate());
        p.setEndDate(r.getEndDate());
        p.setEmployees(resolve(r.getEmployeeIds()));
        return toResponse(repo.save(p));
    }

    @Transactional
    public ProjectDto.Response update(Long id, ProjectDto.Request r) {
        Project p = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setStatus(r.getStatus());
        p.setPriority(r.getPriority());
        p.setStartDate(r.getStartDate());
        p.setEndDate(r.getEndDate());
        p.setEmployees(resolve(r.getEmployeeIds()));
        return toResponse(repo.save(p));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Project not found");
        repo.deleteById(id);
    }

    private Set<User> resolve(List<Long> ids) {
        return ids == null ? new HashSet<>() : new HashSet<>(users.findAllById(ids));
    }

    public ProjectDto.Response toResponse(Project p) {
        int taskCount = p.getTasks() != null ? p.getTasks().size() : 0;
        int completedTaskCount = p.getTasks() != null ? (int) p.getTasks().stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count() : 0;
        int progressPercentage = taskCount > 0 ? (int) Math.round((completedTaskCount * 100.0) / taskCount) : (p.getStatus() == ProjectStatus.COMPLETED ? 100 : 0);

        return ProjectDto.Response.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .status(p.getStatus())
                .priority(p.getPriority())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .employees(p.getEmployees().stream().map(es::toSummary).toList())
                .taskCount(taskCount)
                .completedTaskCount(completedTaskCount)
                .progressPercentage(progressPercentage)
                .build();
    }
}
