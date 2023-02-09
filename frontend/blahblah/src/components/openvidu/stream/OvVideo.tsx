import React, { Component } from "react";
import user from "../../../redux/modules/user";
import EmotionExpression from "../../emotion/EmotionExpression";
import "./StreamComponent.css";

// 타입 생성
interface OvVideoProps {
  user: any;
  mutedSound: any;
  isPublisher: boolean | null;
}

// OvVideoComponent
export default class OvVideoComponent extends Component<OvVideoProps, {}> {
  // OvVideoComponent class 타입 정의
  // =======================================================

  videoRef: any;

  // =======================================================

  constructor(props: OvVideoProps) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    if (this.props && this.props.user.streamManager && !!this.videoRef) {
      console.log("PROPS: ", this.props);
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }

    if (
      this.props &&
      this.props.user.streamManager.session &&
      this.props.user &&
      !!this.videoRef
    ) {
      this.props.user.streamManager.session.on(
        "signal:userChanged",
        (event: any) => {
          const data = JSON.parse(event.data);
          if (data.isScreenShareActive !== undefined) {
            this.props.user
              .getStreamManager()
              .addVideoElement(this.videoRef.current);
          }
        }
      );
    }
  }

  componentDidUpdate(props: any) {
    if (props && !!this.videoRef) {
      this.props.user.getStreamManager().addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return (
      <div>
        <video
          autoPlay={true}
          id={"video-" + this.props.user.getStreamManager().stream.streamId}
          ref={this.videoRef}
          muted={this.props.mutedSound}
        />

        {(this.props.isPublisher == false && this.videoRef) && <EmotionExpression user={this.props.user} videoRef={this.videoRef} />}
      </div>
    );
  }
}
