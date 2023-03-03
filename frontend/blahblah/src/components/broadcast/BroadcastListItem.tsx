import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/configStore";
import { broadcastActions } from "../../redux/modules/broadcast/broadcast-slice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
const BroadcastListItem: React.FC<{ session: any }> = (props) => {
  // 방송 진입
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const broadcast = useSelector((state: RootState) => state.broadcast);

  const joinSessionStart = async () => {
  // console.log(props.session.sessionId);
    dispatch(
      broadcastActions.joinSession({ sessionId: props.session.sessionId })
    );
  };

  const onClickHandler = () => {
    joinSessionStart().then(() => {
      navigate("/broadcast");
    });
  };

  return (
    <div onClick={onClickHandler}>세션 아이디 : {props.session.sessionId}</div>
  );
};

export default BroadcastListItem;
