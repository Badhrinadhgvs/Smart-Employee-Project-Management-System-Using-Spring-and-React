package com.evernorth.smartemp.repository;

import com.evernorth.smartemp.entity.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByApprovedFalseOrderByIdAsc();

    @Query("""
        SELECT u FROM User u WHERE
        (:search IS NULL OR :search = '' OR
         LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(u.department) LIKE LOWER(CONCAT('%', :search, '%'))) AND
        (:department IS NULL OR :department = '' OR u.department = :department)
        """)
    Page<User> search(@Param("search") String search, @Param("department") String department, Pageable pageable);
}
