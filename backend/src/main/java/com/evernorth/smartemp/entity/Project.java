package com.evernorth.smartemp.entity;

import com.evernorth.smartemp.enums.Priority;
import com.evernorth.smartemp.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(length = 2000) private String description;
    @Enumerated(EnumType.STRING) private ProjectStatus status;
    @Enumerated(EnumType.STRING) private Priority priority;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToMany
    @JoinTable(name = "project_employees",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    @Builder.Default
    private Set<User> employees = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Task> tasks = new HashSet<>();
}
