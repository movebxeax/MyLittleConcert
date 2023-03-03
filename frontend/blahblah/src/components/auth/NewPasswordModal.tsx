import styled from "@emotion/styled";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import React, { useState, ReactFragment } from "react";
import { useAppDispatch } from "../../redux/configStore.hooks";
import { sendPasswordAction } from "../../redux/modules/user";
import { removeToken } from "../../redux/modules/user/token";
import ButtonComp from "../common/ButtonComp";
import BasicModal from "../ui/BasicModal";

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 32px;
`;

const buttonBoxStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "32px",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function NewPasswordModalModal() {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useAppDispatch();

  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSendPassword = () => {
    dispatch(
      sendPasswordAction({
        userId: id,
        email: email,
      })
    );
    handleClose();
  };

  return (
    // <React.Fragment>
    <div>
      <ButtonComp
        text="비밀번호 재발급"
        onClick={handleOpen}
        onlyText={true}
        width={130}
      />
      <BasicModal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          component="form"
          sx={{
            "& .MuiFormControl-root": { m: 1, width: "25ch", display: "flex" },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl variant="standard">
            <InputLabel htmlFor="id">ID *</InputLabel>
            <Input id="id" value={id} onChange={onChangeId} required />
          </FormControl>
          <FormControl variant="standard">
            <InputLabel htmlFor="email">email *</InputLabel>
            <Input
              id="email"
              value={email}
              onChange={onChangeEmail}
              type="email"
              required
            />
          </FormControl>
          <ButtonWrapper>
            <ButtonComp
              text="비밀번호 재발급"
              onClick={onSendPassword}
              width={130}
            />
            <ButtonComp text="CLOSE" onClick={handleClose} onlyText={true} />
          </ButtonWrapper>
        </Box>
      </BasicModal>
    </div>
    // </React.Fragment>
  );
}

