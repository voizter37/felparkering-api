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
import se.voizter.felparkering.api.repository.AttendantGroupRepository;

@RestController
@RequestMapping("/attendants")
public class AttendantGroupController {

    private final AttendantGroupRepository repository;

    AttendantGroupController(AttendantGroupRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<AttendantGroup> all() {
        return repository.findAll();
    }

    @PostMapping
    AttendantGroup createAttendant(@RequestBody AttendantGroup group) {
        return repository.save(group);
    }

    @DeleteMapping("/{id}")
    void deleteGroup(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
}
