package com.evernorth.smartemp.entity;

import com.evernorth.smartemp.enums.Priority;
import com.evernorth.smartemp.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(length = 2000) private String description;
    @Enumerated(EnumType.STRING) private TaskStatus status;
    @Enumerated(EnumType.STRING) private Priority priority;
    private LocalDate deadline;
    @Column(length = 1000) private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
}
