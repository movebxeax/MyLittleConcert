import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const ButtonWrapper = styled.div<{
  width: number | undefined;
  height: number | undefined;
  active: boolean;
  onlyText?: boolean;
}>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : "90px")};
  height: ${({ height }) => (height ? `${height}px` : "35px")};
  & > button {
    position: absolute;
    left: -3px;
    top: -3px;
    width: 100%;
    height: 100%;
    padding: 7px 12px;
    border: 1.5px solid black;
    border-radius: 13px;
    background: #54d7c7;
    color: white;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    ${({ onlyText }) =>
      onlyText &&
      css`
        background: none;
        color: #54d7c7;
        border: none;
      `}
    & > span {
    }
    & > svg {
      font-size: 18px;
    }
    &:hover {
      background: #59d7c8;
      ${({ onlyText }) =>
        onlyText &&
        css`
          background: none;
          color: #a8efe7;
        `}
    }
    ${({ active, onlyText }) =>
      active &&
      !onlyText &&
      css`
        color: #ffffffcc;
        background: #55cdbe;
        box-shadow: inset -2px -2px 5px 2px #99ede4,
          inset 3px 2px 6px 2px #298c80;
        & > span {
          margin-top: 3px;
        }
        & > svg {
          margin-top: 3px;
        }
      `}
    &:active {
      color: #ffffffcc;
      background: #55cdbe;
      box-shadow: inset -2px -2px 5px 2px #99ede4, inset 3px 2px 6px 2px #298c80;
      & > span {
        margin-top: 3px;
      }
      & > svg {
        margin-top: 3px;
      }
      ${({ onlyText }) =>
        onlyText &&
        css`
          background: none;
          box-shadow: none;
          color: #8ae7dc;
        `}
    }
  }
  & > div {
    width: 100%;
    height: 100%;
    border: 1.5px solid black;
    border-radius: 13px;
    background: #3ba89b;
    ${({ onlyText }) =>
      onlyText &&
      css`
        border: none;
        background: none;
      `}
  }
`;

type ButtonCompPropsType = {
  text: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  active?: boolean;
  type?: "button" | "submit";
  onlyText?: boolean;
};

export default function ButtonComp({
  text,
  onClick = () => {},
  width,
  height,
  children,
  active = false,
  type = "button",
  onlyText = false,
}: ButtonCompPropsType): JSX.Element {
  return (
    <ButtonWrapper
      width={width}
      height={height}
      active={active}
      onlyText={onlyText}
    >
      <button onClick={onClick} type={type}>
        <span>{text}</span>
        {children}
      </button>
      <div></div>
    </ButtonWrapper>
  );
}

