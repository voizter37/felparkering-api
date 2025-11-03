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
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.enums.Role;

@DataJpaTest
public class UserRepositoryTests {
    @Autowired
    UserRepository userRepository;

    @Autowired
    AttendantGroupRepository groupRepository;

    @Test
    void canSaveAndFindByEmail() {
        User user = new User();
        user.setEmail("test-user@example.com");
        user.setPassword("123abc");
        user.setRole(Role.ADMIN);
        user.setAttendantGroup(null);
        
        userRepository.save(user);
        Optional<User> result = userRepository.findByEmail(user.getEmail());

        assertTrue(result.isPresent());
        assertEquals(user.getId(), result.get().getId());
        assertEquals("test-user@example.com", result.get().getEmail());
        assertEquals("123abc", result.get().getPassword());
        assertEquals(Role.ADMIN, result.get().getRole());
        assertEquals(null, result.get().getAttendantGroup());
    }

    @Test
    void findByEmailReturnsEmptyWhenNotFound() {
        Optional<User> result = userRepository.findByEmail("test-user@example.com");
        assertTrue(result.isEmpty());
    }

    @Test
    void canSaveMultipleUsersWithDifferentRoles() {
        User admin = new User();
        admin.setEmail("adminr@example.com");
        admin.setPassword("admin123");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User attendant = new User();
        attendant.setEmail("attendant@example.com");
        attendant.setPassword("attendant123");
        attendant.setRole(Role.ATTENDANT);
        userRepository.save(attendant);

        User customer = new User();
        customer.setEmail("customer@example.com");
        customer.setPassword("customer123");
        customer.setRole(Role.CUSTOMER);
        userRepository.save(customer);

        assertTrue(userRepository.findByEmail("adminr@example.com").isPresent());
        assertTrue(userRepository.findByEmail("attendant@example.com").isPresent());
        assertTrue(userRepository.findByEmail("customer@example.com").isPresent());
    }

    @Test
    void cannotSaveUserWithDuplicateEmail() {
        User user1 = new User();
        user1.setEmail("1@example.com");
        user1.setPassword("123");
        user1.setRole(Role.CUSTOMER);
        userRepository.save(user1);

        User user2 = new User();
        user2.setEmail("1@example.com");
        user2.setPassword("321");
        user2.setRole(Role.CUSTOMER);

        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user2);
        });
    }

    @Test
    void shouldThrowExceptionWhenMissingRequiredField() {
        User user1 = new User();
        user1.setEmail("1@example.com");
        user1.setRole(Role.CUSTOMER);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user1);
        });

        User user2 = new User();
        user2.setPassword("123");
        user2.setRole(Role.CUSTOMER);
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user2);
        });

        User user3 = new User();
        user1.setEmail("1@example.com");
        user3.setPassword("123");
        
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user3);
        });
    }

    @Test 
    void canSaveReportWithAttendantGroup() {
        AttendantGroup group = new AttendantGroup();
        group.setName("Testgruppen");
        AttendantGroup savedGroup = groupRepository.save(group);

        User user = new User();
        user.setEmail("assigned@example.com");
        user.setPassword("secure");
        user.setRole(Role.ATTENDANT);
        user.setAttendantGroup(savedGroup);
        User savedUser = userRepository.save(user);

        assertEquals("Testgruppen", savedUser.getAttendantGroup().getName());
    }
}


