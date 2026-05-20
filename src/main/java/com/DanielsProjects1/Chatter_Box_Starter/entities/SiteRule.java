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
@Table(name = "site_rules")
@EntityListeners(AuditingEntityListener.class)
public class SiteRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String rule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id",  nullable = false)
    private Site site;

    private boolean active = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant lastModifiedAt;


}
