import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera, OrbitControls, CycleRaycast , useHelper, PointerLockControls} from '@react-three/drei'
import { render, useFrame } from 'react-three-fiber';
import { RecoilRoot, useRecoilState } from "recoil";
import { targetPositionState } from "../state/GameState";
import { RigidBody } from '@react-three/rapier';


export const Target = () => {
    const [targetPosition, setTargetPosition] = useRecoilState(targetPositionState);
    // const distance = model.scene.position.distanceTo(player.position)
    const [pos, setPos] = useState([]);
    const model = useGLTF("/target.glb")
    const onClick = useCallback((e) => {
        e.stopPropagation();
        
        setTargetPosition(model.scene.position);
        console.log(targetPosition)
      }, [targetPosition]);

      
      

    useEffect(() => {
        // setTargetPosition(model.scene.position);
        
    }, [])
    
    useFrame((state, delta, mouse) => {
        
    })


    return (
        pos,
            <>
            <group>
                <RigidBody>
                    
                </RigidBody>
                    <mesh onClick={onClick}>
                        <primitive object={model.scene} position={[3.5, 0.45, 21]} rotation={[0,1,0]} scale={1.5} name="target"/>
                    </mesh>

            </group>
            </>
            
    )
}

