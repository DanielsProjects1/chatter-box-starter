package com.DanielsProjects1.Chatter_Box_Starter.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String username) {
        super("Username is already in use: " + username);
    }
}
