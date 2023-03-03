package com.blahblah.web.controller;


import com.blahblah.web.controller.exception.CustomException;
import com.blahblah.web.dto.response.Message;
import com.blahblah.web.dto.response.UserDTO;
import com.blahblah.web.dto.response.UserMeDTO;
import com.blahblah.web.service.UserService;
import com.blahblah.web.util.JWTutil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RequestMapping("/users")
@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity insertUser(@RequestBody UserDTO userInfo){
        UserDTO ans = userService.createUser(userInfo);
        if(ans == null){
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "가입 실패");
        }else {
            return ResponseEntity.status(HttpStatus.CREATED).body(new Message("가입 성공"));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity checkDuplicatedId(@PathVariable String userId){
        if(userService.isExistUserId(userId))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("이미 존재하는 사용자 ID입니다"));
        else return ResponseEntity.ok(new Message("사용가능한 사용자 ID입니다"));
    }

    @GetMapping("/nickName/{nickName}")
    public ResponseEntity checkDuplicatedNickName(@PathVariable String nickName){
        if(userService.isExistUserNickName(nickName))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("이미 존재하는 사용자 닉네임입니다"));
        else return ResponseEntity.ok(new Message("사용가능한 사용자 닉네임입니다"));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity checkDuplicatedEmail(@PathVariable String email){
        if(userService.isExistEmail(email))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("이미 존재하는 이메일입니다"));
        else return ResponseEntity.ok(new Message("사용가능한 이메일입니다"));
    }

    @GetMapping("/me")
    public ResponseEntity getMyInfo(HttpServletRequest request){
        String accessToken =request.getHeader("Authorization").substring(7);
        String userId = JWTutil.getIdByAccessToken(accessToken);
        UserDTO userInfo = userService.readUserByUserId(userId);

        return ResponseEntity.ok(
                UserMeDTO.builder().avatar(userInfo.getAvatar())
                        .email(userInfo.getEmail())
                        .userId(userInfo.getUserId())
                        .id(userInfo.getId())
                        .lightStick(userInfo.getLightStick())
                        .phoneNumber(userInfo.getPhoneNumber())
                        .nickName(userInfo.getNickName())
                        .avatar(userInfo.getAvatar())
                        .subscribers(userInfo.getSubscribers())
                        .build()
        );
    }

    @PutMapping()
    public ResponseEntity updateUser(@RequestBody UserDTO userDTO, HttpServletRequest request){
        String accessToken =request.getHeader("Authorization").substring(7);
        String userId = JWTutil.getIdByAccessToken(accessToken);
        if(!userId.equals(userDTO.getUserId())) throw new CustomException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        if(userService.updateUser(userDTO))
            return ResponseEntity.ok(new Message("회원정보 수정 성공"));
        else return ResponseEntity.internalServerError().build();
    }

    @DeleteMapping
    public ResponseEntity deleteUser(HttpServletRequest request){
        String accessToken =request.getHeader("Authorization").substring(7);
        String userId = JWTutil.getIdByAccessToken(accessToken);
        userService.deleteUserByUserId(userId);
        return ResponseEntity.ok(new Message("회원 탈퇴 완료"));
    }
}
