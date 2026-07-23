package com.evernorth.smartemp.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; private String action; private String username; private String details; private LocalDateTime createdAt; }
