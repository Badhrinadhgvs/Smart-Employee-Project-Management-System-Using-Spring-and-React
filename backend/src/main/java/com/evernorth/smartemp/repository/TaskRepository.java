package com.evernorth.smartemp.repository;

import com.evernorth.smartemp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedEmployeeId(Long employeeId);
    List<Task> findByProjectId(Long projectId);
}
