package com.blahblah.web.dto.response;

import com.blahblah.web.dto.request.CommentDTO;
import com.blahblah.web.entity.CommentVideoEntity;
import com.blahblah.web.entity.VideoEntity;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VideoDTO {

    private Long id;
    private Long userPK;
    private String userId;
    private String nickName;
    private String avatar;
    private String title;
    private Long views;
    private String recordingId;
    private String sessionId;
    private Long timeStamp;
    private Double playTime;
    private String thumbnail;
    private String pathUrl;
    private LocalDateTime createDate;
    private String hashtags;
    private boolean like;
    private int likeCnt;
    private Page<CommentDTO> comments;

    public Page<VideoDTO> toDtoList(Page<VideoEntity> videoList){
        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createDate"));
        int start = (int) pageRequest.getOffset();
        int end = start+pageRequest.getPageSize();
        Page<VideoDTO> videos = videoList.map(v -> VideoDTO.builder()
                .id(v.getId())
                .title(v.getTitle())
                .views(v.getViews())
                .nickName(v.getUserEntity().getNickName())
                .avatar(v.getUserEntity().getAvatar())
                .userPK(v.getUserEntity().getId())
                .recordingId(v.getRecodingId())
                .sessionId(v.getSessionId())
                .timeStamp(v.getTimeStamp())
                .playTime(v.getPlayTime())
                .thumbnail(v.getThumbnail())
                .pathUrl(v.getPathUrl())
                .createDate(v.getCreateDate())
                .userId(v.getUserEntity().getUserId())
                .hashtags(v.getHashtags())
                //.comments(new CommentDTO().toVDtoList(new PageImpl<>(v.getComments().subList(start, Math.min(end, v.getComments().size())), pageRequest, v.getComments().size())))
                .build());
        return videos;
    }
}
