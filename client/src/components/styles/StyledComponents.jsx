import { keyframes, Skeleton, styled } from "@mui/material";
import React from "react";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../constants/color";
const StyledComponents = () => {
  return <div></div>;
};
export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});
export const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;

 
  

`;
export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 2rem;
  border-radius: 2rem;
  background-color: ${grayColor};
`;
export const SearchField = styled("input")`
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  border: none;
  outline: none;
  width: 20vmax;
  background-color: ${grayColor};

  font-size: 1.1rem;
`;
export const CurvedButton = styled("button")`
  border-radius: 2rem;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 1);
  border: none;
  color: white;
  outline: none;
  opacity: 0.8;
  cursor: pointer;
  font-size: 1.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
export const StyledContainer = styled("div")`
  padding: 1rem;
  margin: 1rem;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
`;
const bounceAnimation = keyframes`

  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`;
export const BouncingSkeleton = styled(Skeleton)(()=>({
  animation: `${bounceAnimation} 1s infinite`,
}))

export default StyledComponents;
