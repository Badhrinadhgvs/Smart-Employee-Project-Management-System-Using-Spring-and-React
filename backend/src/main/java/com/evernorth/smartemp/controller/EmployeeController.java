package com.evernorth.smartemp.controller;

import com.evernorth.smartemp.dto.EmployeeDto;
import com.evernorth.smartemp.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService s;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "firstName", "lastName", "department", "designation", "salary", "hireDate"
    );

    @GetMapping("/me")
    public ResponseEntity<EmployeeDto.ProfileResponse> getMyProfile(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(s.getMyProfile(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<EmployeeDto.ProfileResponse> updateMyProfile(
            org.springframework.security.core.Authentication auth,
            @RequestBody EmployeeDto.ProfileUpdateRequest request) {
        return ResponseEntity.ok(s.updateMyProfile(auth.getName(), request));
    }

    @GetMapping("/list")
    public ResponseEntity<List<EmployeeDto.Response>> list() {
        return ResponseEntity.ok(s.listAll());
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeDto.Response>> search(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(s.search(search, department, PageRequest.of(page, size, parseSort(sort))));
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

