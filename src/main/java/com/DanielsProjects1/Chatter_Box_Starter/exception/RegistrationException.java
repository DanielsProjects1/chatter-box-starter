package com.DanielsProjects1.Chatter_Box_Starter.exception;

public class RegistrationException extends RuntimeException {
    public RegistrationException(String message) {
        super(message);
    }

    public RegistrationException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }
}
