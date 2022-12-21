import { useGLTF } from "drei";
import { useState } from "react";
import { Suspense } from "react";
import { useFrame } from "react-three-fiber";


const Enemy= () => {

    const model = useGLTF('/Enemy.glb')
    const [toggle, setToggle] = useState(false);

    useFrame((state, delta) => {
        
    })

    return (
        <>
        <Suspense fallback={null}>
            <primitive object={model.scene} onClick={() => setToggle(!toggle)} scale={toggle ? 1.5 : 1}/>
        </Suspense>
        </>
    )
}

export default Enemy;