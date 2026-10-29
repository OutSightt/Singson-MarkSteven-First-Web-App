package edu.bsit.lastname.dto;

import java.time.LocalDate;

public record DashboardResponse(String fullName, String email, String role,
                                LocalDate memberSince, long totalUsers) {
}
