package se.voizter.felparkering.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.voizter.felparkering.api.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
}