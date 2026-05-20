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
@Table(
    name = "threads",
    uniqueConstraints = @UniqueConstraint(columnNames = { "site_id", "page_url" })
)
@EntityListeners(AuditingEntityListener.class)
public class Box {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String pageUrl;

    @Column(nullable = false)
    private boolean locked = false;

    @Column(nullable = false)
    private boolean active = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
