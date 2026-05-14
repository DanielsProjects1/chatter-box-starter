package com.DanielsProjects1.Chatter_Box_Starter.entities;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String username;

    private String passHash;

    private String email;

    private String profilePictureUrl;

    private String banner;

    private String displayName;

    private String bio;

    @Enumerated(EnumType.STRING)
    private GlobalRole globalRole =  GlobalRole.USER;

    private boolean active;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
