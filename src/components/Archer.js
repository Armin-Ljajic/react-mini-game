/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, PerspectiveCamera, OrbitControls, CycleRaycast , useHelper, PointerLockControls, Trail, Sphere} from '@react-three/drei'
import * as THREE from 'three';
import {Quaternion, Raycaster, Vector3, BoxHelper} from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useInput } from '../hooks/useInput';
import { Physics, RapierCollider, RigidBody, useRapier } from '@react-three/rapier';
import { lerp } from 'three/src/math/MathUtils';
import {Target} from './Target';
import { archerPositionState, targetPositionState } from "../state/GameState";
import { useRecoilState } from 'recoil';



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

const useForwardRaycastArrow = (obj) => {
  const raycaster = useMemo(() => new Raycaster(), [])
  const pos = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])
  const scene = useThree((state) => state.scene)
  
  return () => {
    if (!obj.current) return []
    raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
    // raycaster.set(obj.current.getWorldPosition(pos), dir)
    return raycaster.intersectObjects(scene.children)
  }
}




export function Model({action, position}) {
  const {pos} = Target();

  const group = useRef()
  const currentAction = useRef("");
  const controlsRef = useRef(OrbitControls);
  const {forward, backward, left, right, jump, shift, shoot} = useInput();
  const model = useGLTF('/ErikaArcherWithAimingAnimationsNew.glb');
  const arrowModel = useGLTF("/arrow.glb")
  const { actions } = useAnimations(model.animations, model.scene)
  const previousAction = usePrevious(action);
  const camera = useThree(state => state.camera);
  const {scene} = useThree();
  const [arrows, setArrows] = useState([]);
  const [targetPosition, setTargetPosition] = useRecoilState(targetPositionState);
  const [arrowVisibility, setArrowVisibility] = useState(true);



  const api = useRef();
  const ref = useRef();
  const swampRef = useRef();
  const arrowRef = useRef();
  const raycast = useForwardRaycast(ref);
  const arrowRaycast = useForwardRaycastArrow(arrowRef);
  let enemyPosition = new THREE.Vector3();
  const sphere = [];
 
  

  const arrowSpeed = 80;
  const arrowCoolDown = 300;
  let timeToShoot = 0;
 

  const updateCameraTarget = (moveX, moveZ) => {
    // move camera
    camera.position.x += moveX;
    camera.position.z += moveZ;
    // camera.position.y += moveY;
    

    // update camera target
    cameraTarget.x = model.scene.position.x;
    cameraTarget.y = model.scene.position.y + 2;
    cameraTarget.z = model.scene.position.z;
    if(controlsRef.current) controlsRef.current.target = cameraTarget;
  };


  let walkDirection = new THREE.Vector3();
  let rotateAngle = new THREE.Vector3(0, 1, 0);
  let rotateQuarternion = new THREE.Quaternion();
  let cameraTarget = new THREE.Vector3();
  let storedFall = 0;
  const pos2 =  new Vector3()
  let dir2 =  new Vector3()
  const arrowRaycaster = new THREE.Raycaster();

  
  useEffect(() => {
    cameraTarget.x = model.scene.position.x;
    cameraTarget.y = model.scene.position.y + 2;
    cameraTarget.z = model.scene.position.z;
    if(controlsRef.current) controlsRef.current.target = cameraTarget;


    if(arrowRef.current == undefined){
      setArrows((arrows) => [
        ...arrows,
        {
          id: now,
          position: [0, 0, 0],
          rotation: []
          // forward: [arrowModel.scene.position.x += arrowDirectionX, arrowModel.scene.position.y += arrowDirectionY, arrowModel.scene.position.z += arrowDirectionZ]
        }
      ]);
    }
    // console.log(arrows)
    if(previousAction){
      // actions[previousAction].stop()
    }
    let action = "";
    const now = Date.now();
    
    if(forward|| backward || left || right){
      action = "WalkForward";
      if(shift){
        action = "RunForward"
        if(jump){
          action = "RunningJump"
        }
      }
    } else if(jump){
      action = "Jump";

    } else if(shoot){
      action = "StandingDrawArrow";
      // actions[action]?.setLoop(THREE.LoopOnce)

    } else{
      action = "Idle";

    } 
    if(currentAction.current != action){
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn().play();
      currentAction.current = action;
    }

    //hide object from scene when it reaches target
    // const distance = model.scene.position.distanceTo(targetPosition);
    // if(distance < 0.1){
    //  setArrowVisibility(false);
     
    // }
    // else{
    //   setArrowVisibility(true);
      
    // }

    // arrowRef.current.position.x += arrowDirectionX 
    //   arrowRef.current.position.y += arrowDirectionY
    //   arrowRef.current.position.z += arrowDirectionZ 

    }, [action, actions, forward, backward, left, right, jump, shift, shoot, arrowVisibility]);


    useFrame((state, delta, mouse) => {
      if(currentAction.current === "WalkForward" ||
      currentAction.current === "RunForward"
      ) {
        //calculate towards camera direction
        let angleYCameraDirection = Math.atan2(
          camera.position.x - model.scene.position.x,
          camera.position.z - model.scene.position.z
        )
        console.log(targetPosition)
        // console.log(actions)
        
        //diagonal movement angle offset
        let newDirectionOffset = directionOffset({
          forward,
          backward,
          left,
          right,
        });
        
        rotateQuarternion.setFromAxisAngle(
          rotateAngle,
          angleYCameraDirection + newDirectionOffset
        )
        model.scene.quaternion.rotateTowards(rotateQuarternion, 0.2);
        

        // calculate direction
        camera.getWorldDirection(walkDirection);
        walkDirection.y = 0;
        walkDirection.normalize();
        walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

        // run/walk velocity
        let velocity = currentAction.current == "RunForward" ? 4 : 1.8;


        //intersections
        const intersections = raycast();
        
        
        
        
        const walkable = scene.children.filter(
          (o) => o.children[0]?.uuid !== ref?.current?.uuid
        );
  
      const translation = api.current.translation();
      if (translation.y < -1) {
        // don't fall below ground

            translation.x = 0;
            translation.y = 10; 
            translation.z =  0;
        }
    
      // } else {
        walkDirection.y += (storedFall, -9.81 * delta, 0.10)
        storedFall = walkDirection.y
        
        if(intersections.length > 0){
          model.scene.position.copy(intersections[0].point)
          const point = intersections[0].point;
          let diff = model.scene.position.y - (point.y + 0.28);
          if(diff < 0.0){
            storedFall = 0;
            walkDirection.y += lerp(0, Math.abs(diff), 0.5);
            // console.log(point);
          }
        }

        // update model and camera
        const moveX = walkDirection.x * velocity * delta;
        const moveZ = walkDirection.z * velocity * delta;
        
        
        translation.x = model.scene.position.x += moveX;
        translation.y = model.scene.position.y += walkDirection.y
        translation.z = model.scene.position.z += moveZ;

        updateCameraTarget(moveX, moveZ);
        

       
        
      };

      
      let cameraDirection = new Vector3();
      camera.getWorldDirection(cameraDirection);
      const bulletDirection = cameraDirection.clone().multiplyScalar(35);
      
      
      // let lookAt = arrowModel.scene.lookAt(direction);

      //Shooting
      const arrowDirectionX = cameraDirection.x * arrowSpeed * 20 * delta;
      const arrowDirectionY = cameraDirection.y * arrowSpeed * 20 * delta;
      const arrowDirectionZ = cameraDirection.z * arrowSpeed * 20 * delta;

      

      // const arrowDirectionX = direction.x
      // const arrowDirectionY = direction.y 
      // const arrowDirectionZ = direction.z 

      // arrowModel.scene.position.x += arrowDirectionX
      // arrowModel.scene.position.y += arrowDirectionY
      // arrowModel.scene.position.z += arrowDirectionZ
      
      
     
      arrowRef.current.position.x += arrowDirectionX 
      arrowRef.current.position.y += arrowDirectionY
      arrowRef.current.position.z += arrowDirectionZ 
     
      
      const arrowPosition = model.scene.position.clone()
      .add(cameraDirection.clone().multiplyScalar(2))

      

     
      
     

      if(currentAction.current === "StandingDrawArrow") {
        const now = Date.now();
        if (now >= timeToShoot) {
          timeToShoot = now + arrowCoolDown;
          setArrows((arrows) => [
            ...arrows,
            {
              id: now,
              position: [arrowPosition.x, arrowPosition.y+2, arrowPosition.z],
              forward: [arrowDirectionX, arrowDirectionY, arrowDirectionZ]
            }
          ].slice(1));
          
        }
        
         
      }

      
      // var dir = arrowRef.current.getWorldDirection(dir2);
      // var pos = arrowRef.current.getWorldPosition(pos2)

      // arrowRaycaster.set(arrowPosition, arrowRef.current.position);
      // console.log(arrowPosition, arrowRef.current.position)
      // console.log("pos",pos, "dir", dir2)
      var intersects = arrowRaycast();
      // var intersects = arrowRaycaster.intersectObjects(scene.children);

      
        if(intersects.length > 0 ){
            // setArrowVisibility(false);
            console.log(intersects[0].object.name)
        }
      
      // else{
      //     setArrowVisibility(true);
      // }

    });

    

    return (
      
    <>
          
          <OrbitControls 
          ref={controlsRef} 
          target={model.scene.position} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2}
          maxDistance={100}
          />
          {/* <AimTarget position={camera.position}/> */}
          <group>
            <RigidBody ref={api} colliders="ball" type="kinematicPosition" >
              <primitive 
              object={model.scene} 
              ref={ref} name="Archer" 
              key={model.scene.uuid} 
              position={[-0.2, 3.05, 32]}/> 
            </RigidBody>
          
          </group>
            
          {arrows.map((arrow) => {
              return (
               <>

                  {/* <Arrow 
                    rotation={[0, 5 ,0]} 
                    position={arrow.position} 
                    // velocity={arrow.forward}
                    key={`${arrow.id}`}
                  /> */}
                  {/* <mesh visible={arrowVisibility ? true : false} >
                    <primitive 
                    // visible={!shoot}
                    object={arrowModel.scene} 
                    ref={arrowRef} 
                    position={arrow.position} 
                    key={`${arrow.id}`} 
                    scale={0.010}
                    rotation={arrow.rotation}
                    // transparent={true}
                    // visible={arrowVisibility}
                    
                    />
                  </mesh> */}
                   
                  <mesh visible={shoot == false}>
                  <Trail
                    width={2} // Width of the line
                    length={10}
                    color={'white'} // Color of the line
                    decay={10}
                    attenuation={(x) => { return  x * x}} // A function to define the width in each point along it.
                    target={arrowRef}
                    >
                        <Sphere args={[0.5, 64]} position={arrow.position} ref={arrowRef} >
                          <meshBasicMaterial color="white"/>
                        </Sphere>
                       
                  </Trail>
                  </mesh>
                  
                    
                 
               </> 
              );
          })}

          {/* <Enemy player={model.scene}/> */}
          
        

    </>

        
  )
}

useGLTF.preload('/archer.glb')

function usePrevious(value){
  const ref = useRef();
  useEffect(() => {
    ref.current = value
  },[value]);
  return ref.current;
}