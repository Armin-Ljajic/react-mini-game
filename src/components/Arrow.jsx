import { useSphere, Physics } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { RigidBody, Box} from "@react-three/rapier";
import React, { Suspense } from "react";

export const Arrow = (props) => {
  
    const model = useGLTF("/arrow.glb")

  return (
        <Suspense fallback={null}>
            <primitive {...props} object={model.scene} scale={0.005}/>
        </Suspense>
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