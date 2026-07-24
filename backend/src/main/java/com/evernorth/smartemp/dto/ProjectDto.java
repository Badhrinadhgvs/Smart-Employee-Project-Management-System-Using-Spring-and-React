package com.evernorth.smartemp.dto;

import com.evernorth.smartemp.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

public final class ProjectDto {
    private ProjectDto() {}
    @Getter @Setter @Builder public static class Response {
        private Long id; private String name; private String description; private ProjectStatus status; private Priority priority;
        private LocalDate startDate; private LocalDate endDate; private List<EmployeeDto.Summary> employees;
        private int taskCount; private int completedTaskCount; private int progressPercentage;
    }
    @Getter @Setter @Builder public static class Request {
        @NotBlank private String name; private String description; private ProjectStatus status; private Priority priority;
        private LocalDate startDate; private LocalDate endDate; private List<Long> employeeIds;
    }
}
