package com.blahblah.web.controller;

import com.blahblah.web.dto.response.Message;
import com.blahblah.web.dto.response.SubscribeDTO;
import com.blahblah.web.entity.UserSubscribeEntity;
import com.blahblah.web.service.SubscribeService;
import com.blahblah.web.util.JWTutil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RequestMapping("/subscribes")
@RestController
@Slf4j
@RequiredArgsConstructor
public class SubscribeController{
    private final SubscribeService subscribeService;

    @PostMapping
    public ResponseEntity createSubscribe(@RequestBody SubscribeDTO subscribeDTO, HttpServletRequest request){
        long userId = JWTutil.getLongIdByAccessToken(request);

        if(userId==subscribeDTO.getUserPK()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Message("본인은 구독할 수 없음"));
        }
        UserSubscribeEntity sub = subscribeService.addSubscribe(userId, subscribeDTO.getUserPK());
        if(sub == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("구독 실패"));
        }else {
            return ResponseEntity.status(HttpStatus.CREATED).body(new Message("구독 성공"));
        }
    }

    @GetMapping
    public ResponseEntity readSubscribe(HttpServletRequest request){
        long userId = JWTutil.getLongIdByAccessToken(request);

        List<SubscribeDTO> subscribes = subscribeService.readSubscribe(userId);
        if(subscribes==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Message("구독 정보를 가져올 수 없습니다."));
        }
        return ResponseEntity.ok(subscribes);
    }

    @DeleteMapping("/{subscribeId}")
    public ResponseEntity deleteSubscribe(@PathVariable long subscribeId, HttpServletRequest request){
        long userId = JWTutil.getLongIdByAccessToken(request);

        if(userId==subscribeId) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Message("본인 구독 불가"));

        subscribeService.deleteSubscribe(userId, subscribeId);
        return ResponseEntity.status(HttpStatus.OK).body(new Message("구독 취소 성공"));

    }

}
