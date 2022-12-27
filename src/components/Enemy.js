import { Html, Select, useAnimations, useGLTF } from "@react-three/drei";
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

const useForwardRaycast = (mouse, camera) => {
    const raycaster = useMemo(() => new Raycaster(), [])
    const pos = useMemo(() => new Vector3(), [])
    const dir = useMemo(() => new Vector3(), [])
    // dir.set(0, -1 , 0)
    const scene = useThree((state) => state.scene)
    
    return () => {
    //   if (!obj.current) return []
    //   raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
    //   raycaster.setFromCamera(mouse, camera)
      return raycaster.intersectObjects(scene.children)
    }
  }
  

export const Enemy= ({position}) => {

    const model = useGLTF('/Enemy.glb')
    const {actions} = useAnimations(model.animations, model.scene);
    const [toggle, setToggle] = useState(false);
    const ref = useRef();
    const api = useRef();
    const raycaster = useForwardRaycast();
    let walkDirection = new THREE.Vector3();
    let storedFall = 0;
    const camera = useThree(state => state.camera);
    const {click} = useInput();
    const targetRef = useRef();
    const raycasterMouse = new THREE.Raycaster()
    const scene = useThree((state) => state.scene)
    const [selected, setSelected] = useState([])


    const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(),
        new THREE.Vector3(),
        0.25,
        0xffff00
    )
  

    const handleClick = () => {
        setToggle(!toggle)
        console.log(toggle);
    }

    useEffect(() => {
        position = model.scene.position;
        let action = "Idle";
        const playIdle = actions[action];
        playIdle?.play()

        function onMouseMove(event) {
            const mouse = {
                x: (event.clientX / document.documentElement.clientWidth) * 2 - 1,
                y: -(event.clientY / document.documentElement.clientHeight) * 2 + 1,
            }

            
            // raycasterMouse.setFromCamera(mouse, cameraPerspective);

            const intersects = raycasterMouse.intersectObjects(scene.children, false)
            console.log(intersects.length)
            if(intersects.length > 0){
                const n = new THREE.Vector3()
                n.copy((intersects[0].face).normal)
                n.transformDirection(intersects[0].object.matrixWorld)
        
                arrowHelper.setDirection(n)
                arrowHelper.position.copy(intersects[0].point)
            }
        }
        document.documentElement.addEventListener('mousemove', onMouseMove, false)

        return () => {
            document.documentElement.addEventListener('mousemove', onMouseMove, false)
        }
        // document.addEventListener("click", handleClick);
        // return () => {
        //     document.addEventListener("click", handleClick);
        
        // };



    }, [actions, toggle, position])

    useFrame(({state, delta, clock}) => {
        //Calculate direction
        camera.getWorldDirection(walkDirection);
        walkDirection.y = 0;
        walkDirection.normalize();
        // walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

        model.nodes.MAW.geometry.boundingBox.min.x += 5;
        model.nodes.MAW.geometry.boundingBox.min.y += 5;
        model.nodes.MAW.geometry.boundingBox.min.z += 5;

        model.nodes.MAW.geometry.boundingBox.max.x += 5;
        model.nodes.MAW.geometry.boundingBox.max.y += 5;
        model.nodes.MAW.geometry.boundingBox.max.z += 5;
        // console.log(model.nodes.MAW)

        // console.log(selected)
        const intersections = raycaster();
        // targetRef.current.rotation.x = clock.getElapsedTime()
        

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
            <group >
                <mesh >
                <group position={[2.5, 0.5, 20]}>
                    <RigidBody colliders="cuboid" type="kinematicPosition" ref={api}>
                        <primitive 
                        object={model.scene} 
                        ref={ref} 
                        onClick={(e) => console.log("clicked", e.target) }
                        />
                    </RigidBody>
                    <mesh ref={targetRef}>
                        <Marker rotation={[0, Math.PI / 1, Math.PI / 1]} position={[0, 3, 0]} >
                            {/* <div style={{ position: 'absolute', fontSize: 10, letterSpacing: -0.5, left: 17.5 }}>north</div> */}
                            <GiVirtualMarker 
                            style={{ color: 'indianred' }} 
                            transparent="true" 
                            opacity={toggle ? 1 : 0} 
                            scale={2}
                            />
                        </Marker>
                    </mesh>
                </group>
                </mesh>
            </group>
        </Suspense>
        </>
    )
}

