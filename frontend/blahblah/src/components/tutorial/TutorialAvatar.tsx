import React, { createElement, useCallback, useEffect } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { createAvatar } from "@dicebear/core";
import { personas } from "@dicebear/collection";
import { useAppSelector } from "../../redux/configStore.hooks";
import { throttle } from "lodash";
import { EmotionSignalType } from "../../model/openvidu/emotionSignalType";
import Surprised from "../../assets/emoji/surprised.png";
import Sad from "../../assets/emoji/sad.png";
import Angry from "../../assets/emoji/angry.png";
import Happy from "../../assets/emoji/happy.png";
import Fearful from "../../assets/emoji/fearful.png";
import Disgusted from "../../assets/emoji/disgusted.png";
import Clap from "../../assets/emoji/clap.png";
import Heart from "../../assets/emoji/heart.png";
import Red from "../../assets/lightStick/red.png";
import Puple from "../../assets/lightStick/puple.png";
import Blue from "../../assets/lightStick/blue.png";
import Green from "../../assets/lightStick/green.png";
import Pink from "../../assets/lightStick/pink.png";

const lightStickShakeKeyFrame = keyframes`
  from {
    transform: rotate(70deg);
    left: -1px;
  }
  to {
    transform: perspective(68px) rotate(60deg) rotateX(311deg)
        translate(18px, 4px);
    left: -19px;
  } 
`;

const lightStickBalladKeyFrame = keyframes`
  from {
  }
  to {
    transform: rotate(90deg) translateX(-6px); 
  }
`;

const emotionKeyFrame2 = keyframes`
  0% {
    top: -10px;
    width: 10px;
    height: 10px;
  }
  30% {
    top: -30px;
    width: 30px;
    height: 30px;
    top: 0;
  }
  35% {
    opacity: 1;
  }
  100% {
    top: -60px;
    opacity: 0;
    width: 20px;
    height: 20px;
  }
`;

const emotionKeyFrame = keyframes`
  0% {
    opacity: 1;
  }
  30% {
    transform: translateX(-20px);
  }
  50% {
    opacity: 1;
  }
  80% {
    transform: translateX(10px);
  }
  100% {
    opacity: 0;
    top: -100px;
    transform: translateX(-5px);
  }
`;

const AvatarCompContainer = styled.div`
  position: relative;
  min-width: 40px;
  min-height: 40px;
  & > img.avatar-comp-avatar {
    width: 100%;
    height: 100%;
  }
  & > div.avatar-comp-emotion {
    position: absolute;
    top: 55px;
    left: calc(50% - 30px);
    width: 60px;
    height: 60px;
    & > span.emotion {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      animation: ${emotionKeyFrame} 2s ease-out infinite;
      /* animation: ${emotionKeyFrame2} 2s ease-out infinite; */
      & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    & > span.ballad {
      position: absolute;
      width: 100px;
      height: 100px;
      top: -40px;
      left: -60px;
      z-index: 10;
      transform-origin: 90% 100%;
      animation: ${lightStickBalladKeyFrame} 1s ease-in-out alternate infinite;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    & > span.shake {
      position: absolute;
      width: 100px;
      height: 100px;
      top: -40px;
      left: -60px;
      z-index: 10;
      /* transform: rotate(70deg);
      transform: perspective(68px) rotate(60deg) rotateX(311deg)
        translate(18px, 4px); */
      animation: ${lightStickShakeKeyFrame} 0.3s ease-in-out alternate infinite;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
`;

type TutorialAvatarPropsType = {
  step: number;
  mission: string;
  setMissionSuccess: any;
  currentState: string;
  currentScore: number;
};

export default function TutorialAvatar({
  step,
  mission,
  setMissionSuccess,
  currentState,
  currentScore,
}: TutorialAvatarPropsType): JSX.Element {
  const avatar = useAppSelector((state) => state.user.userData.avatar!);
  const parentEl = useRef<HTMLDivElement>(null);

  const dataUri = createAvatar(personas, {
    ...JSON.parse(avatar),
  }).toDataUriSync();

  const createEmotion = (state: string) => {
    const spanEl = document.createElement("span");
    if (state === "left") {
      // 왔다갔다
      spanEl.classList.add("ballad");
    } else if (state === "right") {
      // 와악
      spanEl.classList.add("shake");
    } else {
      spanEl.classList.add("emotion");
    }

    const imgEl = document.createElement("img");
    if (state === "sad") {
      imgEl.src = Sad;
    } else if (state === "angry") {
      imgEl.src = Angry;
    } else if (state === "fearful") {
      imgEl.src = Fearful;
    } else if (state === "disgusted") {
      imgEl.src = Disgusted;
    } else if (state === "surprised") {
      imgEl.src = Surprised;
    } else if (state === "clap") {
      imgEl.src = Clap;
    } else if (state === "happy") {
      imgEl.src = Happy;
    } else if (state === "left" || state === "right") {
      // 응원봉
      imgEl.src = Pink;
    } else {
      imgEl.src = Heart;
    }

    spanEl.appendChild(imgEl);
    parentEl.current?.appendChild(spanEl);

    setTimeout(
      () => {
        spanEl.remove();
      },
      state === "left" ? 4000 : state === "right" ? 2500 : 2000
    );
  };

  const throttled = useCallback(
    throttle((state) => createEmotion(state), 4000),
    []
  );

  useEffect(() => {
    if (
      mission === "happy" ||
      mission === "clap" ||
      mission === "heart" ||
      mission === "left" ||
      mission === "right"
    ) {
      if (currentState === mission) {
        throttled(currentState);
        setTimeout(
          () => {
            setMissionSuccess(true);
          },
          mission === "left" ? 4000 : mission === "right" ? 2500 : 2000
        );
      }
    } else if (mission === "emotion") {
      if (
        currentState &&
        (currentState === "happy" ||
          currentState === "angry" ||
          currentState === "fearful" ||
          currentState === "disgusted" ||
          currentState === "surprised")
      ) {
        throttled(currentState);
        setTimeout(() => {
          setMissionSuccess(true);
        }, 2000);
      }
    }
  }, [currentState, currentScore]);

  useEffect(() => {
    if (mission === "") {
      setMissionSuccess(true);
    }
  }, [step]);

  useEffect(() => {
    createEmotion("heart");
  }, []);

  return (
    <AvatarCompContainer>
      <img className="avatar-comp-avatar" alt="Sample" src={dataUri} />
      <div className="avatar-comp-emotion" ref={parentEl}>
        {/* <span className="shake">
          <img src={Pink} alt="" />
        </span> */}
      </div>
    </AvatarCompContainer>
  );
}

