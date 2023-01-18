import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera, OrbitControls, CycleRaycast , useHelper, PointerLockControls} from '@react-three/drei'
import { render, useFrame } from 'react-three-fiber';
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { targetPositionState } from "../state/GameState";
import { RigidBody } from '@react-three/rapier';


export const Target = (props) => {
    const [targetPosition, setTargetPosition] = useRecoilState(targetPositionState);
    const targets =  useRecoilValue(targetPositionState);
    const  {position, rotation} = useRecoilValue(targetPositionState); // const distance = model.scene.position.distanceTo(player.position)
    const [tar, setTar] = useState([])
    const [pos, setPos] = useState([]);
    const model = useGLTF("/target.glb")
    const { nodes, materials } = useGLTF("/target.glb");
    const onClick = useCallback((e) => {
        e.stopPropagation();
        
        setTargetPosition(model.scene.position);
        console.log(targetPosition)
      }, [targetPosition]);

      
      

    useEffect(() => {
        setTar(targets)
        // setTargetPosition(model.scene.position);
            
        
                // console.log(tar)
        
    }, [targets, position, rotation])
    
    useFrame((state, delta, mouse) => {
        //
    })

    function TargetModel(props) {
        const { nodes, materials } = useGLTF('/target.glb')
        nodes.Circle001_0.geometry.name = "target"
        nodes.Circle001_0.updateMatrixWorld();
        return (
          <group {...props} dispose={null} >
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.29} >
              <RigidBody colliders="hull" type="fixed">
                <mesh geometry={nodes.Circle001_0.geometry} material={materials['Material.001']} position={[-1.8, 2.72, 2.45]} rotation={[0.16, -1.12, 0.18]} scale={1.45}/>
              </RigidBody>
            </group>
          </group>
        )
      }


    return (
        pos,
        <>
            <>
                <TargetModel position={[position[0].x, position[0].y, position[0].z]} rotation={[rotation[0].x, rotation[0].y, rotation[0].z]}/>
                <TargetModel position={[position[1].x, position[1].y, position[1].z]} rotation={[rotation[1].x, rotation[1].y, rotation[1].z]}/>
            </>
        </>
            
    )
}

