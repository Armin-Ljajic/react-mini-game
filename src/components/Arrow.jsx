import { useSphere, Physics } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { RigidBody, Box} from "@react-three/rapier";
import React, { Suspense, useEffect, useRef } from "react";

export const Arrow = ({position, direction, speed}) => {

    const model = useGLTF("/arrow.glb")
    const ref = useRef();
    const [x, y, z] = position
    const [dx, dy, dz] = direction

    useEffect(() => {
      ref.transform.setPosition(x + dx, y + dy, z + dz)
      ref.update()
    }, [ref, x, y, z, dx, dy, dz])
  
    useEffect(() => {
      ref.velocity.set(dx * speed, dy * speed, dz * speed)
      ref.update()
    }, [ref, dx, dy, dz, speed])

  return (
        <mesh ref={ref} position={position}>
          <primitive object={model.scene} scale={0.005}/>
        </mesh>
  );
};

// const [sphereRef] = useSphere(() => ({
//     mass: 5,
//     args: 0.1,
//     ...props
//   }));

//   return (
//     <Physics>
//         <mesh ref={sphereRef} castShadow>
//             <sphereBufferGeometry args={[0.1, 32, 32]} />
//             <meshLambertMaterial color="hotpink" />
//         </mesh>
//     </Physics>
//   );
// };