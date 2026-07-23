package com.evernorth.smartemp.controller;

import com.evernorth.smartemp.dto.ProjectDto;
import com.evernorth.smartemp.enums.*;
import com.evernorth.smartemp.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService s;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "name", "status", "priority", "startDate", "endDate"
    );

    @GetMapping
    public ResponseEntity<Page<ProjectDto.Response>> search(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(s.search(search, status, priority, PageRequest.of(page, size, parseSort(sort))));
    }

    @PostMapping
    public ResponseEntity<ProjectDto.Response> create(@Valid @RequestBody ProjectDto.Request r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(s.create(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto.Response> update(@PathVariable Long id, @Valid @RequestBody ProjectDto.Request r) {
        return ResponseEntity.ok(s.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        s.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.unsorted();
        }
        String[] parts = sort.split(",");
        String field = parts[0].trim();
        if (!ALLOWED_SORT_FIELDS.contains(field)) {
            return Sort.unsorted();
        }
        Sort.Direction dir = (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim()))
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        return Sort.by(dir, field);
    }
}

