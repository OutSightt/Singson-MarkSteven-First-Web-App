package edu.bsit.lastname.config;

import edu.bsit.lastname.repository.UserRepository;
import edu.bsit.lastname.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Creates the default ADMIN account every time the server starts (H2 is in-memory). */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserService service;
    private final UserRepository repo;

    @Value("${userhub.admin.fullName:System Administrator}")
    private String adminName;

    @Value("${userhub.admin.email:admin@userhub.com}")
    private String adminEmail;

    @Value("${userhub.admin.password:Admin@12345}")
    private String adminPassword;

    public DataSeeder(UserService service, UserRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (!repo.existsByEmail(adminEmail.trim().toLowerCase())) {
            service.createUser(adminName, adminEmail, adminPassword, "ADMIN");
            System.out.println("Seeded ADMIN user: " + adminEmail);
        }
    }
}
