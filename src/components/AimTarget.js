// Draws two sprites in front of the ship, indicating the direction of fire.

import { useRef } from "react";
import { useFrame, useThree} from "react-three-fiber";
import { useTexture } from "@react-three/drei/core";
import * as THREE from 'three'
import { TextureLoader } from "three";
import { GiConsoleController } from "react-icons/gi";
import { Camera } from "react-three-fiber";

// Uses a TextureLoader to load transparent PNG, and sprite to render on a 2d plane facing the camera.
export function AimTarget({position}) {
    // Create refs for the two sprites we will create.
    const rearTarget = useRef();
    const frontTarget = useRef();
  
    // const loader = new TextureLoader();
    // A png with transparency to use as the target sprite.
    const loader = new TextureLoader();
    // A png with transparency to use as the target sprite.
    const texture = loader.load("/textures/aimTarget.png");

    const camera = useThree(state => state.camera)
  
    // Update the position of both sprites based on the mouse x and y position. The front target has a larger scalar.
    // Its movement in both axis is exagerated since its farther in front. The end result should be the appearance that the
    // two targets are aligned with the ship in the direction of laser fire.
    useFrame(({ mouse }) => {
      rearTarget.current.position.y = -position.y;
      rearTarget.current.position.x = -position.x;
  
    //   frontTarget.current.position.y = -position.y *-1.5;
    //   frontTarget.current.position.x = -position.x *-7.5;
        // console.log(position)
    });
    // Return a group containing two sprites. One positioned eight units in front of the ship, and the other 16 in front.
    // We give the spriteMaterial a map prop with the loaded sprite texture as a value/
    return (
      <group>
        <mesh position={[0, 0, 25]} ref={rearTarget}>
            <sphereGeometry args={[1,1,1]}/>
            <meshStandardMaterial map={texture} color="black" attach="material"/>
        </mesh>
        {/* <mesh position={[0, 0, -16]} ref={frontTarget}>
            <sphereGeometry args={[1,1,1]}/>
            <meshStandardMaterial map={texture} color="black" attach="material" />
        </mesh> */}
      </group>
    );
  }
