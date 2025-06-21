package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.model.AttendantGroup;
import se.voizter.felparkering.api.repository.AttendantGroupRepository;

@RestController
public class AttendantGroupController {

    private final AttendantGroupRepository repository;

    AttendantGroupController(AttendantGroupRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/attendants")
    List<AttendantGroup> all() {
        return repository.findAll();
    }

    @PostMapping("/attendants")
    AttendantGroup createAttendant(@RequestBody AttendantGroup group) {
        return repository.save(group);
    }

    @DeleteMapping("/attendants/{id}")
    void deleteGroup(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
}
