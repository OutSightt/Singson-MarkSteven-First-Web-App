package edu.bsit.lastname.service;

import edu.bsit.lastname.dto.DashboardResponse;
import edu.bsit.lastname.dto.LoginRequest;
import edu.bsit.lastname.dto.LoginResponse;
import edu.bsit.lastname.dto.RegisterRequest;
import edu.bsit.lastname.dto.UpdateProfileRequest;
import edu.bsit.lastname.dto.UserResponse;
import edu.bsit.lastname.exception.AuthException;
import edu.bsit.lastname.exception.ForbiddenException;
import edu.bsit.lastname.model.User;
import edu.bsit.lastname.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository repo;
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();   // token -> userId

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // ------------------------------------------------------------ Registration

    public UserResponse register(RegisterRequest req) {
        return toResponse(createUser(req.fullName(), req.email(), req.password(), "USER"));
    }

    /** Shared by registration (role USER) and the admin seeder (role ADMIN). */
    public User createUser(String fullName, String email, String rawPassword, String role) {
        String normalizedEmail = email.trim().toLowerCase();
        if (repo.existsByEmail(normalizedEmail))
            throw new IllegalArgumentException("Email already used");
        User u = new User();
        u.setFullName(fullName.trim());
        u.setEmail(normalizedEmail);
        u.setPassword(hash(rawPassword));
        u.setRole(role);
        return repo.save(u);
    }

    // ---------------------------------------------------------- Authentication

    public LoginResponse login(LoginRequest req) {
        User u = repo.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new AuthException("Invalid credentials"));
        if (!u.getPassword().equals(hash(req.password())))
            throw new AuthException("Invalid credentials");
        String token = UUID.randomUUID().toString();
        sessions.put(token, u.getId());
        return new LoginResponse(token, toResponse(u));
    }

    /** Server-side logout: forget the token so it can never be used again. */
    public void logout(String header) {
        authenticate(header);                 // 401 if not logged in
        sessions.remove(extractToken(header));
    }

    public User authenticate(String header) {
        if (header == null || header.isBlank()) throw new AuthException("Please log in");
        Long id = sessions.get(extractToken(header));
        if (id == null) throw new AuthException("Session expired");
        return repo.findById(id).orElseThrow(() -> new AuthException("Session expired"));
    }

    // ------------------------------------------------------------ Authorization

    public void requireRole(User u, String role) {
        if (!role.equals(u.getRole()))
            throw new ForbiddenException("Access denied");
    }

    // --------------------------------------------------------------- Dashboard

    public DashboardResponse dashboard(User u) {
        return new DashboardResponse(u.getFullName(), u.getEmail(),
                u.getRole(), u.getCreatedAt(), repo.count());
    }

    public List<UserResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    // ----------------------------------------------------------------- Profile

    public UserResponse profile(User u) {
        return toResponse(u);
    }

    public UserResponse updateProfile(User u, UpdateProfileRequest req) {
        u.setFullName(req.fullName().trim());
        return toResponse(repo.save(u));
    }

    // ----------------------------------------------------------------- Helpers

    private String extractToken(String header) {
        String h = header.trim();
        return h.startsWith("Bearer ") ? h.substring(7).trim() : h;
    }

    private String hash(String raw) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256")
                    .digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole());
    }
}
