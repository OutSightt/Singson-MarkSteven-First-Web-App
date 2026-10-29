package edu.bsit.lastname.controller;

import edu.bsit.lastname.dto.UpdateProfileRequest;
import edu.bsit.lastname.dto.UserResponse;
import edu.bsit.lastname.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private static final String AUTH = "Authorization";
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public UserResponse me(@RequestHeader(value = AUTH, required = false) String t) {
        return service.profile(service.authenticate(t));
    }

    /** Edit my profile: a user can only ever change their own full name. */
    @PutMapping("/me")
    public UserResponse update(@RequestHeader(value = AUTH, required = false) String t,
                               @Valid @RequestBody UpdateProfileRequest req) {
        return service.updateProfile(service.authenticate(t), req);
    }
}
