package com.DanielsProjects1.Chatter_Box_Starter.entities;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "comment_reports",
        uniqueConstraints = @UniqueConstraint(columnNames = {"comment_id", "user_id"})
)
@EntityListeners(AuditingEntityListener.class)
public class CommentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "violated_site_rule_id")
    private SiteRule violatedRule;

    @Enumerated(EnumType.STRING)
    private ReportReason reason =  ReportReason.OTHER;

    private String explanation;

    @Enumerated(EnumType.STRING)
    private ReportAction actionTaken =  ReportAction.PENDING;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant lastModifiedAt;
}
