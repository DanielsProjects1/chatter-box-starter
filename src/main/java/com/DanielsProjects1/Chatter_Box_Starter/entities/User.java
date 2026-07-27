package com.DanielsProjects1.Chatter_Box_Starter.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    private UUID id; // GenerateValue annotation removed since Keycloak provides the ID.
    //Basically this is telling Hibernate "the ID will always be provided externally"
    @Column(unique = true)
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
