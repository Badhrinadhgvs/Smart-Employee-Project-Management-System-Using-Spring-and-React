package com.evernorth.smartemp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

public final class EmployeeDto {
    private EmployeeDto() {}
    @Getter @Setter @Builder public static class Response {
        private Long id; private String username; private String email; private String firstName; private String lastName;
        private String department; private String designation; private Double salary; private String phone; private LocalDate hireDate; private List<String> roles;
    }
    @Getter @Setter @Builder public static class Summary {
        private Long id; private String firstName; private String lastName; private String designation;
    }
    @Getter @Setter @Builder public static class Request {
        private String username; @NotBlank private String email; private String firstName; private String lastName;
        private String department; private String designation; private Double salary; private String phone; private List<String> roles; private String password;
    }
    @Getter @Setter @Builder public static class ProfileResponse {
        private Long id; private String username; private String email; private String firstName; private String lastName;
        private String department; private String designation; private Double salary; private String phone; private LocalDate hireDate; private List<String> roles;
        private int assignedTaskCount; private int completedTaskCount; private int assignedProjectCount;
    }
    @Getter @Setter @Builder public static class ProfileUpdateRequest {
        private String firstName; private String lastName; private String phone; private String department; private String password;
    }
}
