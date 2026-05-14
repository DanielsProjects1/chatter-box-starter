package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SiteMemberRepository extends JpaRepository<SiteMember, UUID> {

}
