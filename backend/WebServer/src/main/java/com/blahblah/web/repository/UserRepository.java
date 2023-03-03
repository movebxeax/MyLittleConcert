package com.blahblah.web.repository;


import com.blahblah.web.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByUserId(String userId);

    boolean existsByNickName(String nickName);

    boolean existsByEmail(String email);

    UserEntity findByEmail(String email);

    @Modifying
    @Query(value="update users u set u.password=:password where u.id=:id", nativeQuery = true)
    int updatePasswordByEmail(@Param("id") long id, @Param("password")String password);

    void deleteByUserId(String userId);

    Optional<UserEntity> findByUserId(String userId);

    @Query(value = "select * from users u where u.id in (select subscribe_user_id from user_subscribes where user_id = ? )", nativeQuery = true)
    List<UserEntity> findAllByUserId (long userId);
}
