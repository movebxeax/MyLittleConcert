package com.blahblah.web.service;

import com.blahblah.web.controller.exception.CustomException;
import com.blahblah.web.dto.HashTag;
import com.blahblah.web.dto.request.CommentDTO;
import com.blahblah.web.dto.response.VideoDTO;
import com.blahblah.web.entity.CommentVideoEntity;
import com.blahblah.web.entity.LikeVideoEntity;
import com.blahblah.web.entity.VideoEntity;
import com.blahblah.web.repository.LikeVideoRepository;
import com.blahblah.web.repository.UserRepository;
import com.blahblah.web.repository.VideoRepository;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VideoServiceImpl implements VideoService{
    private final LikeVideoRepository likeVideoRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    @Override
    public VideoEntity createVideo(VideoDTO videoDTO) {
        VideoEntity v = VideoEntity.builder()
                .userId(videoDTO.getUserPK())
                .userEntity(userRepository.findById(videoDTO.getUserPK()).orElseThrow(()->new CustomException(HttpStatus.NOT_FOUND, "사용자가 유효하지 않습니다.")))
                .title(videoDTO.getTitle())
                .views(0)
                .hashtags(videoDTO.getHashtags())
                .pathUrl(videoDTO.getPathUrl())
                .build();
        return videoRepository.save(v);
    }

    @Override
    public Page<VideoDTO> readVideos(long userPK, long size, long page) {
        PageRequest pageRequest = PageRequest.of((int)page, (int)size, Sort.by(Sort.Direction.DESC, "create_date"));

        Page<VideoEntity> result = videoRepository.findAllBy(userPK, pageRequest);
        Page<VideoDTO> videos = new VideoDTO().toDtoList(result);

        return videos;
    }

    @Override
    public Page<VideoDTO> readMyVideos(long userPK, long size, long page) {
        PageRequest pageRequest = PageRequest.of((int) page, (int)size, Sort.by(Sort.Direction.DESC, "createDate"));

        Page<VideoEntity> result = videoRepository.findAllByUserId(userPK, pageRequest);
        Page<VideoDTO> videos = new VideoDTO().toDtoList(result);

        return videos;
    }

    @Override
    public Page<VideoDTO> readAllVideos(long size,long page) {
        PageRequest pageRequest = PageRequest.of((int)page, (int)size, Sort.by(Sort.Direction.DESC, "createDate"));
        Page<VideoEntity> result = videoRepository.findAll(pageRequest);
        Page<VideoDTO> videos = new VideoDTO().toDtoList(result);
        return videos;
    }

    @Override
    public VideoDTO getVideo(long videoId, long userPK) {
        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createDate"));
        int start = (int) pageRequest.getOffset();
        int end = start+pageRequest.getPageSize();

        VideoEntity v = videoRepository.findById(videoId).orElseThrow(()->new CustomException(HttpStatus.NOT_FOUND, "찾는 비디오가 유효하지 않습니다."));

        videoRepository.updateViewsById(v.getViews()+1, v.getId());

        LikeVideoEntity result = likeVideoRepository.findByUserIdAndVideoId(userPK, v.getId());
        List<LikeVideoEntity> list = likeVideoRepository.findAllByVideoId(v.getId());
        boolean check = false;
        if(result!=null) check = true;
        VideoDTO video = VideoDTO.builder()
                .id(v.getId())
                .avatar(v.getUserEntity().getAvatar())
                .nickName(v.getUserEntity().getNickName())
                .userId(v.getUserEntity().getUserId())
                .userPK(v.getUserId())
                .pathUrl(v.getPathUrl())
                .comments(new CommentDTO().toVDtoList(new PageImpl<CommentVideoEntity>(v.getComments().subList(start, Math.min(end, v.getComments().size())), pageRequest, v.getComments().size())))
                .title(v.getTitle())
                .sessionId(v.getSessionId())
                .recordingId(v.getRecodingId())
                .timeStamp(v.getTimeStamp())
                .thumbnail(v.getThumbnail())
                .like(check)
                .likeCnt(list.size())
                .hashtags(v.getHashtags())
                .createDate(v.getCreateDate())
                .views(v.getViews()+1)
                .build();

        return video;
    }


    @Override
    public void deleteVideo(long id) {
        videoRepository.deleteById(id);
    }

    @Override
    public Page<VideoDTO> readVideosByHashTag(long size, long page, String hashTag) {
        Gson gson = new Gson();
        Type type = new TypeToken<List<HashTag>>(){}.getType();

        List<HashTag> hashTags = gson.fromJson(hashTag, type);
        List<Integer> hashTagKeys = new ArrayList<>();

        hashTags.forEach((ht)-> hashTagKeys.add(ht.getKey()));

        PageRequest pageRequest = PageRequest.of((int)page, (int)size, Sort.by(Sort.Direction.DESC, "views"));
        return new VideoDTO().toDtoList(videoRepository.findByHashtagKeys(hashTagKeys, pageRequest));
    }
}
