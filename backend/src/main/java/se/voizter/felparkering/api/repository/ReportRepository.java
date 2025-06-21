package se.voizter.felparkering.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import se.voizter.felparkering.api.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findById(Long id);
}