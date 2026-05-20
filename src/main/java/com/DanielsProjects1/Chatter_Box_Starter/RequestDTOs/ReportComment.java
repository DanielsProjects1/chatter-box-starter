package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.ReportReason;
import lombok.Data;

import java.util.UUID;

@Data
public class ReportComment {
    private String explanation;
    private ReportReason reason;
    private UUID ruleId;
}
