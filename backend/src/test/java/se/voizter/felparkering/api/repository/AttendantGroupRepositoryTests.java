package se.voizter.felparkering.api.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import se.voizter.felparkering.api.model.AttendantGroup;


@DataJpaTest
public class AttendantGroupRepositoryTests {
    @Autowired
    AttendantGroupRepository groupRepository;

    @Test
    void canSaveAndFindByName() {
        AttendantGroup attendantGroup = new AttendantGroup();
        attendantGroup.setName("test");

        groupRepository.save(attendantGroup);
        Optional<AttendantGroup> result = groupRepository.findByName(attendantGroup.getName());

        assertTrue(result.isPresent());
        assertEquals(attendantGroup.getName(), result.get().getName());
    }

    @Test
    void findByNameReturnsEmptyWhenNotFound() {
        Optional<AttendantGroup> result = groupRepository.findByName("test");

        assertTrue(result.isEmpty());
    }

    @Test
    void cannotSaveAttendantGroupWithDuplicateName() {
        AttendantGroup attendantGroup1 = new AttendantGroup();
        attendantGroup1.setName("test");
        groupRepository.save(attendantGroup1);

        AttendantGroup attendantGroup2 = new AttendantGroup();
        attendantGroup2.setName("test");

        assertThrows(DataIntegrityViolationException.class, () -> {
            groupRepository.saveAndFlush(attendantGroup2);
        });
    }

    @Test
    void shouldThrowExceptionWhenMissingRequiredField() {
        AttendantGroup attendantGroup = new AttendantGroup();
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            groupRepository.saveAndFlush(attendantGroup);
        });
    }
}
