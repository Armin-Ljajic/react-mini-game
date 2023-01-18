import { atom } from "recoil";

export const targetPositionState = atom({
    key: "targetPosition", // unique ID (with respect to other atoms/selectors)
    default: {  
    
      position: [{x: 3, y: 0.45, z:21}, {x: -3.9, y: 1.26, z: 11.7}],
    
    
     rotation: [{x: 0, y: 1, z: 0}, {x: 0, y: 2.5, z: 0}]
    
  }// default value (aka initial value)
  });

  export const archerPositionState = atom({
    key: "archerPosition", // unique ID (with respect to other atoms/selectors)
    default: { position: {}, rotation: {} }, // default value (aka initial value)
  });