package se.voizter.felparkering.api.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.UserRepository;
import se.voizter.felparkering.api.security.JwtProvider;
import se.voizter.felparkering.api.type.Role;

@RestController
public class AuthController {
    
    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing credentials"));
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(password)) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtProvider.generateToken(email, user.getRole());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", email,
            "role", user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String confPassword = body.get("confPassword");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing credentials"));
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", "User already exists"));
        }

        if (!password.equals(confPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password and confirmation does not match"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(Role.CUSTOMER);
        
        userRepository.save(user);

        String token = jwtProvider.generateToken(email, user.getRole());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "message", "User registered successfully",
            "email", email,
            "role", user.getRole()
        ));
    }
}
