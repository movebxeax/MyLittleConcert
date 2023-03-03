import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch } from "../../redux/configStore.hooks";
import { signinAction } from "../../redux/modules/user";
import { removeToken } from "../../redux/modules/user/token";
import ButtonComp from "../common/ButtonComp";
import BasicModal from "../ui/BasicModal";
import NewPasswordModal from "./NewPasswordModal";

const buttonBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "32px",
};

export default function SigninModal({
  open,
  setOpen,
  openAlert,
  setOpenAlert,
}: any): JSX.Element {
  const dispatch = useAppDispatch();

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };
  const onChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  const onCloseModal = () => {
    setOpen((prev: boolean) => !prev);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      signinAction({
        userId: id,
        password: pw,
      })
    ).then((data) => {
      if (data.type === "SIGNIN/fulfilled") {
        setOpenAlert({ state: true, username: id });
      }
    });

    onCloseModal();
  };

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
        <FormControl variant="standard">
          <InputLabel htmlFor="id">아이디</InputLabel>
          <Input id="id" value={id} onChange={onChangeId} required />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="pw">비밀번호</InputLabel>
          <Input
            id="pw"
            value={pw}
            onChange={onChangePw}
            type="password"
            required
          />
        </FormControl>
        <Box sx={buttonBoxStyle}>
          <ButtonComp text="SIGNIN" type="submit" />
          {/* <Button variant="contained" type="submit">
            Signin
          </Button> */}
          <NewPasswordModal />
        </Box>
      </Box>
    </BasicModal>
  );
}

