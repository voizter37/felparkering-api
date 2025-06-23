package se.voizter.felparkering.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository repository;

    UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<User> all() {
        return repository.findAll();
    }

    @PostMapping
    User createAttendant(@RequestBody User attendant) {
        // TODO: Inför en check att Role == ATTENDANT
        return repository.save(attendant);
    }

    @DeleteMapping("/{id}")
    void deleteUser(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
}
