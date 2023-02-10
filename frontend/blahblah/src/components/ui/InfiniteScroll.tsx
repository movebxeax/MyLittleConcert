import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { VideoType } from "../../model/video/VideoType";
import { ProfileVideoType } from "../../model/profile/profileVideoType";
import VideoCard from "../video/VideoCard";
import { FeedType } from "../../model/feed/feedType";
import { ProfileFeedType } from "../../model/profile/profileFeedType";
import FeedListItem from "../feed/FeedListItem";
import { VideoWrapType } from "../../model/profile/videoWrapType";
import { useAppDispatch, useAppSelector } from "../../redux/configStore.hooks";
import { getFeedAction, getVideoAction } from "../../redux/modules/profile";
import { useParams } from "react-router-dom";
import { FeedWrapType } from "../../model/profile/feedWrapType";

const InfiniteScrollContainer = styled.div`
  & > ul {
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: 50px;
    & > li {
      list-style: none;
      width: 100%;
    }
  }
`;

type InfiniteScrollPropsType = {
  video?: boolean;
  feed?: boolean;
  itemsWrap?: VideoWrapType | FeedWrapType;
  totalPage: number;
};

export default function InfiniteScroll({
  video = false,
  feed = false,
  itemsWrap,
  totalPage,
}: InfiniteScrollPropsType): JSX.Element {
  const { userpk } = useParams() as { userpk: string };
  const videos = useAppSelector((state) => state.profile.videoData);
  const feeds = useAppSelector((state) => state.profile.feedData);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: totalPage,
  });
  const [itemArr, setItemArr] = useState<
    VideoType[] | ProfileVideoType[] | FeedType[] | ProfileFeedType[]
  >([]);
  // (1)
  const [target, setTarget] = useState<Element | null>(null);
  const dispatch = useAppDispatch();

  const updateItemsFunc = () => {
    if (video && videos) {
      let temp: ProfileVideoType[] = [...(itemArr as ProfileVideoType[])];

      videos.content.map((video) => {
        temp = [...temp, video];
        return temp;
      });
      setItemArr(temp);
    } else if (feed && feeds) {
      let temp: ProfileFeedType[] = [...(itemArr as ProfileFeedType[])];

      feeds.content.map((video) => {
        temp = [...temp, video];
        return temp;
      });
      setItemArr(temp);
    }
  };

  // (2)
  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setPageInfo((prev) => {
          console.log("츄츄!", prev.page);
          if (prev.totalPage > prev.page) {
            return {
              ...prev,
              page: prev.page + 1,
            };
          }
          return prev;
        });
      }
    },
    []
  );

  // (3)
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0,
      root: null,
    });

    target && observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, target]);

  useEffect(() => {
    if (video) {
      console.log(pageInfo.page + " 페이지 부름");
      dispatch(
        getVideoAction({ userPK: userpk, size: 5, page: pageInfo.page })
      ).then(() => {
        updateItemsFunc();
      });
    } else if (feed) {
      dispatch(
        getFeedAction({ userPK: userpk, size: 5, page: pageInfo.page })
      ).then(() => {
        updateItemsFunc();
      });
    }
  }, [pageInfo.page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <InfiniteScrollContainer>
      <ul>
        {itemArr.map((item, idx) => (
          <li key={idx} ref={itemArr.length - 1 === idx ? setTarget : null}>
            {video && (
              <VideoCard
                nth={idx}
                video={item as VideoType | ProfileVideoType}
              />
            )}
            {feed && <FeedListItem feed={item as FeedType | ProfileFeedType} />}
          </li>
        ))}
      </ul>
    </InfiniteScrollContainer>
  );
}

