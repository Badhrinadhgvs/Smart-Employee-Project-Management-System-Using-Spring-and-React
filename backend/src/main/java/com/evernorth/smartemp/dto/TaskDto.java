package com.evernorth.smartemp.dto;

import com.evernorth.smartemp.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

public final class TaskDto {
    private TaskDto() {}
    @Getter @Setter @Builder public static class Response {
        private Long id; private String title; private String description; private TaskStatus status; private Priority priority;
        private LocalDate deadline; private String remarks; private EmployeeDto.Summary assignedEmployee; private ProjectRef project;
    }
    @Getter @Setter @Builder public static class ProjectRef { private Long id; private String name; }
    @Getter @Setter @Builder public static class Request {
        @NotBlank private String title; private String description; private TaskStatus status; private Priority priority;
        private LocalDate deadline; private String remarks; private Long assignedEmployeeId; private Long projectId;
    }
    @Getter @Setter @Builder public static class StatusUpdateRequest { private TaskStatus status; private String remarks; }
}
