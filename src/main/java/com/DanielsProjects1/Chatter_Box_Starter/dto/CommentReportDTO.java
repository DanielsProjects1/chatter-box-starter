package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentReport;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReportAction;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReportReason;
import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRule;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CommentReportDTO {
    private UUID id;
    private UUID commentId;
    private UUID reporterId;
    private ReportAction action;
    private String explanation;
    private String violatedRule;
    private ReportReason reason;
    private Instant createdAt;

    public static CommentReportDTO from(CommentReport report) {
        CommentReportDTO dto = new CommentReportDTO();
        dto.id = report.getId();
        dto.commentId = report.getComment().getId();
        dto.reporterId = report.getUser().getId();
        dto.action = report.getActionTaken();
        dto.explanation = report.getExplanation();
        dto.violatedRule = report.getViolatedRule() != null ? report.getViolatedRule().getRule() : null;
        dto.reason = report.getReason();
        dto.createdAt = report.getCreatedAt();
        return dto;
    }
}
