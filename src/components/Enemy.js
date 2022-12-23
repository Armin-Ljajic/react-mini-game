import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { Suspense } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Raycaster } from "three";
import { Vector3 } from "three";
import * as THREE from 'three';
import { lerp } from "three/src/math/MathUtils";
import { useInput } from "../hooks/useInput";
import {GiVirtualMarker} from 'react-icons/gi'


// Let's make the marker into a component so that we can abstract some shared logic
function Marker({ children, ...props }) {
    // This holds the local occluded state
    const [occluded, occlude] = useState()
    return (
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={occlude}
        // We just interpolate the visible state into css opacity and transforms
        style={{ transition: 'all 0.2s', opacity: occluded ? 0 : 1, transform: `scale(${occluded ? 0.25 : 1})` }}
        {...props}>
        {children}
      </Html>
    )
  }

const directionOffset = ({forward, backward, left, right}) => {
    var directionOffset = 0; // w
  
    if(forward){
      if(left){
        directionOffset = Math.PI / 4 // w+a
      } else if (right){
        directionOffset = -Math.PI / 4 // w+d
      }
    } else if(backward){
      if(left) {
        directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
      } else if (right){
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if(left){
      directionOffset = Math.PI / 2; // a
    } else if(right){
      directionOffset = -Math.PI / 2; // d
    }
  
    return directionOffset;
  }

const useForwardRaycast = (obj) => {
    const raycaster = useMemo(() => new Raycaster(), [])
    const pos = useMemo(() => new Vector3(), [])
    const dir = useMemo(() => new Vector3(), [])
    dir.set(0, -1 , 0)
    const scene = useThree((state) => state.scene)
    
    return () => {
      if (!obj.current) return []
      // raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
      raycaster.set(obj.current.getWorldPosition(pos), dir)
      return raycaster.intersectObjects(scene.children)
    }
  }
  

export const Enemy= () => {

    const model = useGLTF('/Enemy.glb')
    const {actions} = useAnimations(model.animations, model.scene);
    const [toggle, setToggle] = useState(false);
    const ref = useRef();
    const api = useRef();
    const raycaster = useForwardRaycast(ref);
    let walkDirection = new THREE.Vector3();
    let storedFall = 0;
    const camera = useThree(state => state.camera);
    const {click} = useInput();
    const targetRef = useRef();
    const handleClick = () => {
        setToggle(!toggle)
    }

    useEffect(() => {
        let action = "Idle";
        const playIdle = actions[action];
        playIdle?.play()

        
        
        document.addEventListener("click", handleClick);
        return () => {
            document.addEventListener("click", handleClick);
        
        };

    }, [actions, toggle])

    useFrame((state, delta, clock) => {
        //Calculate direction
        camera.getWorldDirection(walkDirection);
        walkDirection.y = 0;
        walkDirection.normalize();
        // walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

        
        const intersections = raycaster();
        targetRef.current.rotation.x = clock.getElapsedTime()
        

        // const translation = api.current.translation();
        // if (translation.y < -1) {
        //       translation.x = 0;
        //       translation.y = 10; 
        //       translation.z =  0;
        //   }

        //   walkDirection.y += (storedFall, -9.81 * delta, 0.10)
        //   storedFall = walkDirection.y

        //   if(intersections.length > 0){
        //     model.scene.position.copy(intersections[0].point)
        //     const point = intersections[0].point;
        //     let diff = model.scene.position.y - (point.y + 0.28);
        //     if(diff < 0.0){
        //         storedFall = 0;
        //         walkDirection.y += lerp(0, Math.abs(diff), 0.5);
        //         // console.log(point);
        //       }
        //   }
    })

    return (
        <>
        <Suspense fallback={null}>
            <group>
                <mesh>
                <group position={[2.5, 0.5, 20]}>
                    <RigidBody colliders="cuboid" type="kinematicPosition" ref={api}>
                        <primitive 
                        object={model.scene} 
                        onClick={() => handleClick() }
                        ref={ref} 
                        />
                    </RigidBody>
                    <mesh>
                        <Marker rotation={[0, Math.PI / 2, Math.PI / 2]} position={[0, 3, 0]} >
                            {/* <div style={{ position: 'absolute', fontSize: 10, letterSpacing: -0.5, left: 17.5 }}>north</div> */}
                            <GiVirtualMarker 
                            style={{ color: 'indianred' }} 
                            transparent="true" 
                            opacity={toggle ? 1 : 0} 
                            scale={2}
                            ref={targetRef}/>
                        </Marker>
                    </mesh>
                    
                </group>
                </mesh>
            </group>
        </Suspense>
        </>
    )
}

