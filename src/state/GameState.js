import { atom } from "recoil";

export const targetPositionState = atom({
    key: "targetPosition", // unique ID (with respect to other atoms/selectors)
    default: { position: {}, rotation: {} }, // default value (aka initial value)
  });