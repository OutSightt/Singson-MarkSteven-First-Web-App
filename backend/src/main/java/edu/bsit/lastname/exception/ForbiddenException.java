package edu.bsit.lastname.exception;

/** Thrown when the user is logged in but does not have the required role (HTTP 403). */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
