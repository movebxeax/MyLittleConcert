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
  checkDuplicateAction,
  signupAction,
  sendEmailAction,
  checkDupNickNameAction,
  checkDupEmailAction,
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

export default function SignupModal({ open, setOpen }: any): JSX.Element {
  const checkDup = useAppSelector((state) => state.user.checkDuplicate);
  const checkDupNick = useAppSelector((state) => state.user.checkDupNickName);
  const checkDupEmail = useAppSelector((state) => state.user.checkDupEmail);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const checkEmailNumber = useAppSelector((state) => state.user.checkEmail);

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [rePw, setRePw] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // const [validEmail, setValidEmail] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [showPw, setShowPw] = useState<boolean>(false);
  const [idAvail, setIdAvail] = useState<string>("PleaseCheckId");
  const [pwAvail, setPwAvail] = useState<boolean>(false);
  const [nickNameActivated, setNickNameActivated] = useState<boolean>(false);
  const [emailActivated, setEmailActivated] = useState<boolean>(false);
  const [nickNameAvail, setNickNameAvail] = useState<string>(
    "PleaseCheckNickName"
  );
  const [rePwAvail, setRePwAvail] = useState<boolean>(false);
  const [emailAvail, setEmailAvail] = useState<string>("PleaseCheckEmail");
  // const [checkEmailNumber, setCheckEmailNumber] = useState<string>("");
  const [checkNumber, setCheckNumber] = useState<string>("");
  const [phoneAvail, setPhoneAvail] = useState<boolean>(false);
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);

    const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (!regex.test(e.target.value)) {
      setIdAvail("RegexFail");
    } else {
      setIdAvail("PleaseCheckId");
    }
  };
  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setNickNameActivated(true);
    setNickNameAvail("PleaseCheckNickName");

    const regex = /^[???-???|???-???|a-z|A-Z|0-9|]+$/;
    if (regex.test(e.target.value) || e.target.value === "") {
      setNickName(e.target.value);
    }
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailActivated(true);
    setEmail(e.target.value);

    const regex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!regex.test(e.target.value)) {
      setEmailAvail("RegexFail");
    } else {
      setEmailAvail("PleaseCheckEmail");
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
  const onChangeIsAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgree((prev) => !prev);
  };

  const onChangeCheckNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckNumber(e.target.value);
  };
  const onConfirmID = () => {
    dispatch(checkDuplicateAction(id));
  };

  const onConfirmEmail = () => {
    dispatch(checkDupEmailAction(email));
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

  const onSendEmail = () => {
    dispatch(sendEmailAction(email));
  };

  const onCloseModal = () => {
    setOpen((prev: boolean) => !prev);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      idAvail &&
      pwAvail &&
      rePwAvail &&
      nickName &&
      emailAvail &&
      (!phone || (phone && phoneAvail)) &&
      isAgree
    ) {
      dispatch(
        signupAction({
          userId: id,
          password: pw,
          nickName,
          email,
          phoneNumber: phone === "" ? null : phone,
        })
      ).then(() => {
        onCloseModal();
      });

      // navigate("/", { replace: true });
    }
  };

  // useEffect(() => {
  //   if (checkEmailNumber.data == checkNumber) {
  //     setValidEmail(true);
  //     setEmailAvail("Available");
  //   } else {
  //     setValidEmail(false);
  //   }
  // }, [checkEmailNumber.data, checkNumber]);

  useEffect(() => {
    if (checkDupEmail.error) {
      setEmailAvail("UnAvailable");
    } else if (checkDupEmail.data) {
      setEmailAvail("Available");
    }
  }, [checkDupEmail]);

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
    if (checkDup.error) {
      setIdAvail("Unavailable");
    } else if (checkDup.data) {
      setIdAvail("Available");
    }
  }, [checkDup]);
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
            <Input
              id="id"
              value={id}
              onChange={onChangeId}
              required
              error={id && idAvail !== "Available" ? true : false}
              aria-describedby="id-helper-text"
              endAdornment={
                <InputAdornment position="end">
                  {idAvail === "Available" && <CheckRounded />}
                </InputAdornment>
              }
            />
            <FormHelperText id="id-helper-text">
              {id &&
                (idAvail === "Available" ? (
                  <span>?????? ????????? ID?????????</span>
                ) : idAvail === "PleaseCheckId" ? (
                  <span>????????? ?????? ????????? ????????????</span>
                ) : idAvail === "RegexFail" ? (
                  <span>???????????? ???????????? ????????? ?????? ?????? 6~20???</span>
                ) : (
                  <span>?????? ???????????? ID?????????</span>
                ))}
            </FormHelperText>
          </FormControl>
          <Button
            onClick={onConfirmID}
            disabled={
              idAvail === "RegexFail" || idAvail === "Available" ? true : false
            }
          >
            ????????? ?????? ??????
          </Button>
        </div>
        <FormControl variant="standard">
          <InputLabel htmlFor="pw">???????????? *</InputLabel>
          <Input
            id="pw"
            value={pw}
            onChange={onChangePw}
            type={showPw ? "text" : "password"}
            required
            error={pw && !pwAvail ? true : false}
            aria-describedby="pw-helper-text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPw}
                  onMouseDown={handleMouseDownPw}
                >
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="pw-helper-text">
            {!pwAvail && <span>??????, ??????, ???????????? ??????, 8~16???</span>}
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="re-pw">???????????? ?????? *</InputLabel>
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
                {rePw && rePwAvail && <CheckRounded />}
              </InputAdornment>
            }
          />
          <FormHelperText id="repw-helper-text">
            {rePw && !rePwAvail && <span>??????????????? ???????????? ????????????</span>}
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="nickName">????????? *</InputLabel>
          <Input
            id="nickName"
            value={nickName}
            onChange={onChangeNickName}
            required
            error={nickNameActivated && nickName === "" ? true : false}
          />
          <FormHelperText id="nick-helper-text">
            {nickNameActivated &&
              (nickNameAvail === "Available" ? (
                <span>?????? ????????? ??????????????????</span>
              ) : nickNameAvail === "UnAvailable" ? (
                <span>?????? ???????????? ??????????????????</span>
              ) : (
                <span>????????? ?????? ????????? ????????????</span>
              ))}
          </FormHelperText>
        </FormControl>
        <Button
          onClick={onConfirmNickName}
          disabled={
            !nickNameActivated ||
            nickName.length === 0 ||
            nickNameAvail === "Available"
          }
          // disabled={
          //   idAvail === "RegexFail" || idAvail === "Available" ? true : false
          // }
        >
          ????????? ?????? ??????
        </Button>
        <FormControl variant="standard">
          <InputLabel htmlFor="email">Email *</InputLabel>
          <Input
            id="email"
            value={email}
            onChange={onChangeEmail}
            type="email"
            required
            error={email && emailAvail !== "Available" ? true : false}
            aria-describedby="email-helper-text"
          />
          <FormHelperText id="email-helper-text">
            {email &&
              (emailAvail === "Available" ? (
                <span>?????? ????????? ????????? ?????????</span>
              )
              : emailAvail === "UnAvailable" ? (
                <span>?????? ???????????? ????????? ?????????</span>
              )
              : emailAvail === "RegexFail" ? (
                <span>????????? ????????? ????????? ????????????</span>
              ) : (
                <span>????????? ?????? ????????? ????????????</span>
              ))}
          </FormHelperText>
        </FormControl>
        <Button
          onClick={onConfirmEmail}
          disabled={
            !emailActivated ||
            email.length === 0 ||
            emailAvail === "Available"
          }
        >
          ????????? ?????? ??????
        </Button>
        {/* <Button
          onClick={onSendEmail}
          disabled={
            emailAvail === "RegexFail" || emailAvail === "Available"
              ? true
              : false
          }
        >
          ???????????? ?????????
        </Button>
        <FormControl variant="standard">
          <InputLabel htmlFor="check-email">?????? ?????? *</InputLabel>
          <Input
            id="check-email"
            value={checkNumber}
            type="string"
            onChange={onChangeCheckNumber}
            required
            error={checkNumber ? true : false}
            aria-describedby="chmail-helper-text"
            endAdornment={
              <InputAdornment position="end">
                {emailAvail === "Available" && <CheckRounded />}
              </InputAdornment>
            }
          />
          <FormHelperText id="chmail-helper-text">
            {checkNumber && !validEmail && (
              <span>??????????????? ???????????? ????????????</span>
            )}
          </FormHelperText>
        </FormControl> */}
        <FormControl variant="standard">
          <InputLabel htmlFor="phone">?????????</InputLabel>
          <Input
            id="phone"
            value={phone}
            onChange={onChangePhone}
            error={phone && !phoneAvail ? true : false}
            aria-describedby="phone-helper-text"
          />
          <FormHelperText id="phone-helper-text">
            {phone && !phoneAvail && (
              <span>????????? ???????????? ????????? ????????????</span>
            )}
          </FormHelperText>
        </FormControl>
        {/* <FormGroup> */}
        <Box style={checkBoxStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAgree}
                onChange={onChangeIsAgree}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="???????????? ?????? ??????"
          />
        </Box>
        {/* </FormGroup> */}
        <Box sx={buttonBoxStyle}>
          <ButtonComp text="SIGNUP" type="submit" />
          <ButtonComp text="CANCEL" onClick={onCloseModal} />
        </Box>
      </Box>
    </BasicModal>
  );
}

