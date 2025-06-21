package se.voizter.felparkering.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import se.voizter.felparkering.api.model.AttendantGroup;

public interface AttendantGroupRepository extends JpaRepository<AttendantGroup, Long> {
    Optional<AttendantGroup> findByName(String name);
    boolean existsByName(String name);
}