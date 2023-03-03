import { CheckRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/configStore.hooks";
import {
  checkDupNickNameAction,
  deleteUserAction,
  updateUserAction,
} from "../../redux/modules/user";
import ButtonComp from "../common/ButtonComp";
import BasicModal from "../ui/BasicModal";

const buttonBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "30px",
  marginTop: "15px",
};

const checkBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function AccountModal({ open, setOpen }: any): JSX.Element {
  const loggedUser = useAppSelector((state) => state.user.userData);
  const checkDupNick = useAppSelector((state) => state.user.checkDupNickName);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [pw, setPw] = useState<string>("!!!!!!!!");
  const [rePw, setRePw] = useState<string>("!!!!!!!!");
  const [nickName, setNickName] = useState<string>(loggedUser.nickName);
  const [email, setEmail] = useState<string>(loggedUser.email);
  const [phone, setPhone] = useState<string | null>(loggedUser.phoneNumber);
  const [showPw, setShowPw] = useState<boolean>(false);
  const [isEditPW, setIsEditPW] = useState<boolean>(false);
  const [pwAvail, setPwAvail] = useState<boolean>(false);
  const [rePwAvail, setRePwAvail] = useState<boolean>(false);
  const [nickNameActivated, setNickNameActivated] = useState<boolean>(false);
  const [nickNameAvail, setNickNameAvail] = useState<string>("Plz Check");
  const [emailAvail, setEmailAvail] = useState<boolean>(false);
  const [phoneAvail, setPhoneAvail] = useState<boolean>(false);

  const onReSetPW = () => {
    setPw("");
    setRePw("");
  };
  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditPW) {
      setIsEditPW(true);
      setRePw("");
    }
    setPw(e.target.value);

    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    if (regex.test(e.target.value)) {
      setPwAvail(true);
    } else {
      setPwAvail(false);
    }
  };
  const onChangeRePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePw(e.target.value);
  };
  const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
    if (regex.test(e.target.value) || e.target.value === "") {
      setNickName(e.target.value);
      setNickNameActivated(true);
    }
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    const regex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (regex.test(e.target.value)) {
      setEmailAvail(true);
    } else {
      setEmailAvail(false);
    }
  };
  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);

    const regex = /\d{3}-\d{3,4}-\d{4}/;
    if (regex.test(e.target.value)) {
      setPhoneAvail(true);
    } else {
      setPhoneAvail(false);
    }
  };

  const onConfirmNickName = () => {
    dispatch(checkDupNickNameAction(nickName));
  };

  const handleClickShowPw = () => {
    setShowPw((prev) => !prev);
  };
  const handleMouseDownPw = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onCloseModal = () => {
    setOpen((prev: boolean) => !prev);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (!isEditPW || (isEditPW && pwAvail && rePwAvail)) &&
      (!nickNameActivated || (nickNameActivated && nickNameAvail)) &&
      (email === loggedUser.email ||
        (emailAvail && email !== loggedUser.email)) &&
      (!phone || phone === loggedUser.phoneNumber || (phone && phoneAvail))
    ) {
      if (isEditPW) {
        dispatch(
          updateUserAction({
            id: loggedUser.id,
            userId: loggedUser.userId,
            password: pw,
            nickName,
            email,
            phoneNumber: phone === "" ? null : phone,
          })
        ).then(() => {
          onCloseModal();
        });
      } else {
        dispatch(
          updateUserAction({
            id: loggedUser.id,
            userId: loggedUser.userId,
            nickName,
            email,
            phoneNumber: phone === "" ? null : phone,
          })
        ).then(() => {
          onCloseModal();
        });
      }

      // onCloseModal();
      // navigate("/main", { replace: true });
    }
  };

  const onClickDelete = () => {
    dispatch(deleteUserAction());
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (pw === rePw) {
      setRePwAvail(true);
    } else {
      setRePwAvail(false);
    }
  }, [pw, rePw]);

  useEffect(() => {
    if (checkDupNick.error) {
      setNickNameAvail("UnAvailable");
    } else if (checkDupNick.data) {
      setNickNameAvail("Available");
    }
  }, [checkDupNick]);

  useEffect(() => {
    if (loggedUser.email !== "") {
      setEmailAvail(true);
    }
  }, []);
  return (
    <BasicModal open={open} setOpen={setOpen}>
      <Box
        component="form"
        sx={{
          "& .MuiFormControl-root": { m: 1, width: "25ch", display: "flex" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <div>
          <FormControl variant="standard">
            <InputLabel htmlFor="id">ID *</InputLabel>
            <Input id="id" value={loggedUser.userId} disabled />
          </FormControl>
        </div>
        <FormControl variant="standard">
          <InputLabel htmlFor="pw">Password *</InputLabel>
          <Input
            id="pw"
            value={pw}
            onChange={onChangePw}
            onFocus={onReSetPW}
            type={showPw ? "text" : "password"}
            required
            error={isEditPW && pw && !pwAvail ? true : false}
            aria-describedby="pw-helper-text"
            endAdornment={
              <InputAdornment position="end">
                {isEditPW && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPw}
                    onMouseDown={handleMouseDownPw}
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            }
          />
          <FormHelperText id="pw-helper-text">
            {isEditPW && !pwAvail && (
              <span>영문, 숫자, 특수문자 포함, 8~16자</span>
            )}
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="re-pw">Re-enter Password *</InputLabel>
          <Input
            id="re-pw"
            value={rePw}
            onChange={onChangeRePw}
            type="password"
            required
            error={rePw && !rePwAvail ? true : false}
            aria-describedby="repw-helper-text"
            endAdornment={
              <InputAdornment position="end">
                {isEditPW && rePw && rePwAvail && <CheckRounded />}
              </InputAdornment>
            }
            disabled={!isEditPW}
          />
          <FormHelperText id="repw-helper-text">
            {rePw && !rePwAvail && <span>비밀번호가 일치하지 않습니다</span>}
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="nickName">nickName *</InputLabel>
          <Input
            id="nickName"
            value={nickName}
            onChange={onChangeNickName}
            aria-describedby="nick-helper-text"
            required
            error={nickNameActivated && nickName === "" ? true : false}
          />
          <FormHelperText id="nick-helper-text">
            {nickNameActivated &&
              (nickNameAvail === "Available" ? (
                <span>사용 가능한 닉네임입니다</span>
              ) : nickNameAvail === "UnAvailable" ? (
                <span>이미 사용중인 닉네임입니다</span>
              ) : (
                <span>닉네임 중복 체크를 해주세요</span>
              ))}
          </FormHelperText>
        </FormControl>
        <Button
          onClick={onConfirmNickName}
          disabled={!nickNameActivated || loggedUser.nickName === nickName}
        >
          닉네임 중복 확인
        </Button>
        <FormControl variant="standard">
          <InputLabel htmlFor="email">email *</InputLabel>
          <Input
            id="email"
            value={email}
            onChange={onChangeEmail}
            type="email"
            required
            error={email && !emailAvail ? true : false}
            aria-describedby="email-helper-text"
          />
          <FormHelperText id="email-helper-text">
            {email && !emailAvail && <span>올바른 이메일 형식이 아닙니다</span>}
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="phone">phone</InputLabel>
          <Input
            id="phone"
            value={phone}
            onChange={onChangePhone}
            error={phone && !phoneAvail ? true : false}
            aria-describedby="phone-helper-text"
          />
          <FormHelperText id="phone-helper-text">
            {phone && !phoneAvail && (
              <span>올바른 전화번호 형식이 아닙니다</span>
            )}
          </FormHelperText>
        </FormControl>
        <Box sx={buttonBoxStyle}>
          <ButtonComp text="CONFIRM" type="submit" />
          <ButtonComp text="CANCEL" onClick={onCloseModal} />
          <ButtonComp text="회원탈퇴" onClick={onClickDelete} />
        </Box>
      </Box>
    </BasicModal>
  );
}

