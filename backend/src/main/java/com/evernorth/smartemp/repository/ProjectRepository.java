package com.evernorth.smartemp.repository;

import com.evernorth.smartemp.entity.Project;
import com.evernorth.smartemp.enums.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("""
        SELECT p FROM Project p WHERE
        (:search IS NULL OR :search = '' OR
         LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND
        (:status IS NULL OR p.status = :status) AND
        (:priority IS NULL OR p.priority = :priority)
        """)
    Page<Project> search(@Param("search") String search, @Param("status") ProjectStatus status,
                          @Param("priority") Priority priority, Pageable pageable);
}
