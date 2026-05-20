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
@Table(name = "muted_users")
@EntityListeners(AuditingEntityListener.class)
public class MutedRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "muted_user_id", nullable = false)
    private User mutedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "muter_id",  nullable = false)
    private User mutedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id")
    private Site site;

    private String reason;

    @CreatedDate
    private Instant createdAt;

    private Instant expiresAt;

}
