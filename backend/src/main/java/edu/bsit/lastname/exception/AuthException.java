package edu.bsit.lastname.exception;

/** Thrown when the user is not logged in or the credentials are wrong (HTTP 401). */
public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}
