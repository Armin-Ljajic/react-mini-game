// Draws two sprites in front of the ship, indicating the direction of fire.

import { useRef } from "react";
import { useFrame, useThree} from "react-three-fiber";
import { useTexture } from "@react-three/drei/core";
import * as THREE from 'three'
import { TextureLoader } from "three";
import { GiConsoleController } from "react-icons/gi";
import { Camera } from "react-three-fiber";
import { useMemo } from "react";
import { Raycaster } from "three";
import { Vector2 } from "three";
import { archerPositionState } from "../state/GameState";
import { useRecoilState } from "recoil";


const useForwardRaycast = (obj) => {
  const raycaster = useMemo(() => new Raycaster(camera.position, vector.sub(
    camera.position).normalize()), [])
  const vector = useMemo(() => new Vector2(), [])
  const camera = useThree(state => state.camera)
  const mouse = useThree(state => state.mouse)
  const scene = useThree((state) => state.scene)
  // var ray = new THREE.Raycaster(camera.position, vector.sub(
  //   camera.position).normalize());
  
  return () => {
    if (!obj.current) return []
    // raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
    raycaster.setFromCamera(mouse, camera)
    return raycaster.intersectObjects(scene.children)
  }
}
// Uses a TextureLoader to load transparent PNG, and sprite to render on a 2d plane facing the camera.
export function AimTarget({position}) {
    // Create refs for the two sprites we will create.
    const rearTarget = useRef();
    const frontTarget = useRef();
    const raycast = useForwardRaycast(rearTarget);
    const [modelPosition, setModelPosition] = useRecoilState(archerPositionState);
  
    // const loader = new TextureLoader();
    // A png with transparency to use as the target sprite.
    const loader = new TextureLoader();
    // A png with transparency to use as the target sprite.
    const texture = loader.load("/textures/aimTarget.png");

    

  
    // Update the position of both sprites based on the mouse x and y position. The front target has a larger scalar.
    // Its movement in both axis is exagerated since its farther in front. The end result should be the appearance that the
    // two targets are aligned with the ship in the direction of laser fire.
    useFrame(({ mouse }) => {
      
     

      const intersections = raycast();
      console.log(intersections)
      rearTarget.current.position.y = -mouse.y *10;
      rearTarget.current.position.x = -mouse.x *30;
     console.log(modelPosition)
  
    //   frontTarget.current.position.y = -position.y *-1.5;
    //   frontTarget.current.position.x = -position.x *-7.5;
        // console.log(position)
    });
    // Return a group containing two sprites. One positioned eight units in front of the ship, and the other 16 in front.
    // We give the spriteMaterial a map prop with the loaded sprite texture as a value/
    return (
        <group>
          <sprite position={[0, 0, -8]} ref={rearTarget}>
            <spriteMaterial attach="material" map={texture} />
          </sprite>
          {/* <sprite position={[0, 0, -16]} ref={frontTarget}>
            <spriteMaterial attach="material" map={texture} />
          </sprite> */}
    </group>
    );
  }
