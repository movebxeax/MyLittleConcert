package com.blahblah.web.repository;

import com.blahblah.web.entity.LikeArticleEntity;
import com.blahblah.web.entity.LikeVideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeArticleRepository extends JpaRepository<LikeArticleEntity, Long> {

    List<LikeArticleEntity> findAllByUserId(long UserId);

    List<LikeArticleEntity> findAllBy();
}
