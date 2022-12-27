import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera, OrbitControls, CycleRaycast , useHelper, PointerLockControls} from '@react-three/drei'




export const Target = ({position}) => {

    const model = useGLTF("/target.glb")

    useEffect(() => {
        position = model.scene.position;
    }, [])

    return (
        <>
            <primitive object={model.scene} position={[3.5, 0.45, 21]} rotation={[0,1,0]} scale={1.5}/>
        </>
    )
}

export default Target;