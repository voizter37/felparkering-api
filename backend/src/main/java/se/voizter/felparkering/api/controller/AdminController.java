package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.AttendantGroupRepository;
import se.voizter.felparkering.api.repository.UserRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AttendantGroupRepository groupRepository;

    AdminController(UserRepository userRepository, AttendantGroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    @GetMapping("/users")
    List<User> allUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    User createAttendant(@RequestBody User attendant) {
        // TODO: Inför en check att Role == ADMIN
        return userRepository.save(attendant);
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
    
    @GetMapping("/attendants")
    List<AttendantGroup> allAttendantGroups() {
        return groupRepository.findAll();
    }

    @PostMapping("/attendants")
    AttendantGroup createAttendantGroup(@RequestBody AttendantGroup group) {
        return groupRepository.save(group);
    }

    @DeleteMapping("/attendants/{id}")
    void deleteGroup(@PathVariable Long id) {
        groupRepository.deleteById(id);
    }
}
