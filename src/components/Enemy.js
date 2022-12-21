import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { Suspense } from "react";
import { useFrame } from "react-three-fiber";


export const Enemy= () => {

    const model = useGLTF('/Enemy.glb')
    const [toggle, setToggle] = useState(false);

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

