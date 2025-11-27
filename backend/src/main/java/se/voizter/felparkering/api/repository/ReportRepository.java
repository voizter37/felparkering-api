package se.voizter.felparkering.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import se.voizter.felparkering.api.enums.Status;
import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findById(Long id);
    List<Report> findByAttendantGroup(AttendantGroup attendantGroup);
    List<Report> findByCreatedBy(User user);

    @Query("""
            SELECT r FROM Report r
            WHERE (:status IS null OR r.status = :status)
            """)
    List<Report> findbyFilters(@Param("status") Status status);

    @Query("""
            SELECT r FROM Report r
            WHERE r.attendantGroup = :attendantGroup
                AND (:status IS null OR r.status = :status)
                AND (:attendant IS null OR r.assignedTo = :attendant)
            """)
    List<Report> findbyFiltersInGroup(@Param("status") Status status, @Param("attendant") User attendant, @Param("attendantGroup") AttendantGroup attendantGroup);

    @Query("""
            SELECT r FROM Report r
            WHERE r.createdBy = :user
                AND (:status IS null OR r.status = :status)
            """)
    List<Report> findbyFiltersCreatedBy(@Param("status") Status status, @Param("user") User user);
}