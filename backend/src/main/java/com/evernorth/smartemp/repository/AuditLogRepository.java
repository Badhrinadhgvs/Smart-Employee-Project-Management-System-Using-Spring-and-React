package com.evernorth.smartemp.repository;
import com.evernorth.smartemp.entity.AuditLog; import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> { java.util.List<AuditLog> findAllByOrderByCreatedAtDesc(); }
