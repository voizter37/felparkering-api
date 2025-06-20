package se.voizter.felparkering.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.voizter.felparkering.api.model.AttendantGroup;

public interface AttendantGroupRepository extends JpaRepository<AttendantGroup, Long> {
}