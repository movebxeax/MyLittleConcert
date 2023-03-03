import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import AvatarComp from "../components/common/AvatarComp";
import EmotionExpression from "../components/emotion/EmotionExpression";
import CompleteModal from "../components/tutorial/CompleteModal";
import StepModal from "../components/tutorial/StepModal";
import TutorialAvatar from "../components/tutorial/TutorialAvatar";
import WelcomeModal from "../components/tutorial/WelcomeModal";
import { useAppSelector } from "../redux/configStore.hooks";

const TutorialPageContainer = styled.div`
  position: relative;
  width: 100%;
  & > div.wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    height: calc(100vh - 80px);
    & > video {
      max-width: 300px;
      height: auto;
      border-radius: 15px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }
    & > div {
      /* flex: 1; */
      width: 350px;
      height: 450px;
      margin: 0 auto;
    }
  }
`;

const stepMessage = [
  // { title: "", text: "카메라 허용을 눌러주세요?" },
  {
    title: "사용자 화면",
    text: "현재 모습을 확인할 수 있어요! 사용자의 표정과 행동을 분석합니다.",
    mission: "",
  },
  {
    title: "사용자 아바타",
    text: "내 표정과 행동에 따라 감정이 표현됩니다! 내 마음을 스트리머에게 대신 전해줄거에요.",
    mission: "",
  },
  {
    title: "감정 표현",
    text: "웃어보세요:) 아바타 위에 웃는 이모티콘이 표시됩니다.",
    mission: "happy",
  },
  {
    title: "감정 표현",
    text: "행복한 표정, 슬픈 표정, 놀란 표정을 읽고 대신 표현해줍니다. 다양한 표정을 지어보세요:)",
    mission: "emotion",
  },
  {
    title: "행동 표현",
    text: "박수를 쳐볼까요?",
    mission: "clap",
  },
  {
    title: "행동 표현",
    text: "머리 위로 하트를 만들어보세요!",
    mission: "heart",
  },
  {
    title: "행동 표현",
    text: "왼손을 들면 응원봉이 움직여요. 응원봉을 움직여주세요!",
    mission: "left",
  },
  {
    title: "행동 표현",
    text: "오른손을 들면 응원봉을 세차게 흔들 수 있어요!",
    mission: "right",
  },
];

function TutorialPage() {
  const localUser = useAppSelector((state) => state.user.userData);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMediaDeviceLoaded, setIsMediaDeviceLoaded] =
    useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("");

  const [welcome, setWelcome] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [missionSuccess, setMissionSuccess] = useState<boolean>(false);

  const onClickPrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };
  const onClickNext = () => {
    if (missionSuccess && step < stepMessage.length - 1) {
      setStep((prev) => prev + 1);
      setMissionSuccess(false);
    } else if (step === stepMessage.length - 1) {
      setComplete(true);
    }
  };

  const constraints = {
    video: {
      width: 1920,
      height: 1080,
    },
    audio: false,
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => ((videoRef.current as any).srcObject = stream))
      .then(() => setIsMediaDeviceLoaded(true))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    // console.log("축하!! 성공!!");
  }, [missionSuccess]);

  useEffect(() => {
    if (!welcome) {
      startVideo();
    }
  }, [welcome]);

  return (
    <TutorialPageContainer>
      <div className="wrapper">
        <video ref={videoRef} autoPlay={true} width={500} height={281} />
        <TutorialAvatar
          step={step}
          mission={stepMessage[step].mission}
          setMissionSuccess={setMissionSuccess}
          currentState={currentState}
          currentScore={0}
        />
      </div>

      {isMediaDeviceLoaded && videoRef && (
        <EmotionExpression
          videoRef={videoRef}
          user={localUser}
          isTutorial={true}
          onStateChange={setCurrentState}
          onPoseChange={setCurrentState}
        />
      )}
      {welcome && <WelcomeModal open={welcome} setOpen={setWelcome} />}
      {!welcome &&
        !complete &&
        stepMessage.map(
          (message, idx) =>
            step === idx && (
              <StepModal
                key={idx}
                message={message}
                page={idx + 1}
                total={stepMessage.length}
                onClickPrev={onClickPrev}
                onClickNext={onClickNext}
                missionSuccess={missionSuccess}
              />
            )
        )}
      {complete && <CompleteModal open={complete} setOpen={setComplete} />}
    </TutorialPageContainer>
  );
}
export default TutorialPage;

