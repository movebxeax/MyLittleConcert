package com.blahblah.web.service;


import com.blahblah.web.controller.exception.CustomException;
import com.blahblah.web.dto.MailDto;
import com.blahblah.web.dto.TokenDTO;
import com.blahblah.web.dto.response.UserDTO;
import com.blahblah.web.dto.response.UserMeDTO;
import com.blahblah.web.entity.UserEntity;
import com.blahblah.web.entity.UserSubscribeEntity;
import com.blahblah.web.repository.SubscribeRepository;
import com.blahblah.web.repository.UserRepository;
import com.blahblah.web.util.JWTutil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@Transactional
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final SubscribeRepository subscribeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    private static final String FROM_ADDRESS = "blahblah207@naver.com";

    private final String DEFAULT_AVATAR =
            "{\"body\":[\"rounded\"],\"clothingColor\":[\"6dbb58\"],\"eyes\":[\"sleep\"],\"facialHair\":[\"\"],\"facialHairProbability\":100,\"hair\":[\"shortCombover\"],\"hairColor\":[\"6c4545\"],\"mouth\":[\"frown\"],\"nose\":[\"wrinkles\"],\"skinColor\":[\"d78774\"]}";

    @Override
    @Transactional(readOnly = true)
    public boolean isExistUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isExistUserNickName(String nickName) {
        return userRepository.existsByNickName(nickName);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isExistEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void mailSend(MailDto mailDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailDto.getAddress());
        message.setSubject(mailDto.getTitle());
        message.setFrom(FROM_ADDRESS);
        message.setText(mailDto.getMessage());
        javaMailSender.send(message);
    }

    @Override
    @Transactional
    public void sendAuthStringToEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);

        SecureRandom secureRandom = new SecureRandom();
        int temporaryPassword = secureRandom.nextInt(888888)+111111;
        userRepository.updatePasswordByEmail(userEntity.getId(), passwordEncoder.encode(String.valueOf(temporaryPassword)));

        MailDto mailDto = MailDto.builder()
                .title("임시비밀번호 안내")
                .address(email)
                .message("임시 비밀번호: "+temporaryPassword)
                .build();

        CompletableFuture.runAsync(()-> mailSend(mailDto));
    }

    @Override
    public String checkEmail(String email) {
        Random r = new Random();
        int checkNum = r.nextInt(888888)+111111;
        MailDto mailDto = MailDto.builder()
                .title("회원 가입 인증 이메일 입니다")
                .message("인증번호는 "+checkNum+"입니다")
                .address(email)
                .build();
        CompletableFuture.runAsync(()-> mailSend(mailDto));
        return Integer.toString(checkNum);
    }


    @Override
    public UserDTO createUser(UserDTO userDTO) {

        String avatar = userDTO.getAvatar();

        UserEntity s = UserEntity.builder()
                .userId(userDTO.getUserId())
                .nickName(userDTO.getNickName())
                .email(userDTO.getEmail())
                .avatar(avatar == null?DEFAULT_AVATAR:avatar)
                .lightStick(userDTO.getLightStick())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .build();
        return userRepository.save(s).toUserDTO();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO readUser(Long id) {
        Optional<UserEntity> op = userRepository.findById(id);
        return op.orElseThrow(()->new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.")).toUserDTO();
    }

    @Override
    public UserDTO readUserByUserId(String userId) {
        UserEntity user = userRepository.findByUserId(userId).
                orElseThrow(()-> new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다."));
        List<UserSubscribeEntity> subscribers = subscribeRepository.findAllBySubscribeUserId(user.getId());

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .nickName(user.getNickName())
                .userId(user.getUserId())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .lightStick(user.getLightStick())
                .phoneNumber(user.getPhoneNumber())
                .subscribers(subscribers.size())
                .build();

        return userDTO;
    }

    @Override
    public boolean checkUser(UserEntity userEntity){
        UserEntity idUser = userRepository.findByUserId(userEntity.getUserId()).orElseThrow(()-> new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다."));
        UserEntity emailUser = userRepository.findByEmail(userEntity.getEmail());
        if(emailUser==null || idUser.getId()!=emailUser.getId()){
            return false;
        }
        return true;
    }

    @Override
    public boolean updateUser(UserDTO userDTO) {
        UserEntity user = userRepository.findByUserId(userDTO.getUserId()).orElseThrow(()->new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다."));
        UserEntity updatedUser = UserEntity.builder().id(userDTO.getId()==null?user.getId():userDTO.getId())
                .userId(userDTO.getUserId()==null?user.getUserId():userDTO.getUserId())
                .password(userDTO.getPassword()==null?user.getPassword():passwordEncoder.encode(userDTO.getPassword()))
                .nickName(userDTO.getNickName()==null?user.getNickName():userDTO.getNickName())
                .phoneNumber(userDTO.getPhoneNumber()==null?user.getPhoneNumber():userDTO.getPhoneNumber())
                .lightStick(userDTO.getLightStick()==null?user.getLightStick():userDTO.getLightStick())
                .avatar(userDTO.getAvatar()==null?user.getAvatar():userDTO.getAvatar())
                .email(userDTO.getEmail()==null?user.getEmail():userDTO.getEmail())
                .build();
        userRepository.save(updatedUser);
        return true;
    }

    @Override
    public void deleteUserByUserId(String userId) {
        userRepository.deleteByUserId(userId);
    }

    @Transactional(readOnly = true)
    @Override
    public TokenDTO login(String userId, String password){
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(()-> new CustomException(
                HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다."
        ));
        if(!passwordEncoder.matches(password, user.getPassword()))
            throw new CustomException(HttpStatus.BAD_REQUEST,"잘못된 비밀번호입니다.");

        String accessToken = JWTutil.getJwtToken(((UserEntity) user).toUserDTO());
        String refreshToken = JWTutil.getRefreshToken(((UserEntity) user).toUserDTO());

        return new TokenDTO(accessToken,refreshToken);
    }
}
