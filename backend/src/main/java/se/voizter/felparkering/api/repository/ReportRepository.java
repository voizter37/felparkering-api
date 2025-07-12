package se.voizter.felparkering.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.Report;
import se.voizter.felparkering.api.model.User;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findById(Long id);
    List<Report> findByAttendantGroup(AttendantGroup attendantGroup);
    List<Report> findByCreatedBy(User user);
}