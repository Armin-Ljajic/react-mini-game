import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useFrame } from "react-three-fiber";


export const Enemy= () => {

    const model = useGLTF('/Enemy.glb')
    const {actions} = useAnimations(model.animations, model.scene);
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        let action = "Idle";
        const playIdle = actions[action];
        playIdle?.play()
    }, [actions])

    useFrame((state, delta) => {
        
    })

    return (
        <>
        <Suspense fallback={null}>
            <mesh onClick={() => setToggle(!toggle)}>
                <primitive object={model.scene}  scale={toggle ? 1.5 : 1}/>
            </mesh>
        </Suspense>
        </>
    )
}

