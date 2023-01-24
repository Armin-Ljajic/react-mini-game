import { OrbitControls, PerspectiveCamera, useFBX, useGLTF, PointerLockControls, useAnimations, Float, Plane, Box, Environment} from "@react-three/drei";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useThree, useFrame, useLoader, extend} from "@react-three/fiber";
import {useBox, usePlane } from "@react-three/cannon";
import { Suspense, useMemo, useRef } from "react";
import {Model} from './Archer.js'
import { useState } from "react";
import {SwampModel} from './Swamp_location.js';
import { Physics, RigidBody, Debug, CuboidCollider, WorldApi, RoundCuboidCollider } from "@react-three/rapier";
import { SceneParticles } from "./SceneParticles.jsx";
import { useControls } from 'leva'
import HealthBar from "./HealthBar.jsx";
import { useEffect } from "react";
import {Enemy} from '../components/Enemy'
import { AimTarget } from "./AimTarget.js";
import Crosshair from "./Crosshair.jsx";
import { Target } from "./Target.js";
import * as THREE from 'three'



function Game() {
  const { debug } = useControls({ debug: false })


  function Lighting() {
    return (
      <>
        <hemisphereLight
          skyColor={0xffffff}
          groundColor={0x444444}
          position={[0, 0, 0]}
        />
        <directionalLight
          color={0xffffff}
          intensity={0.25}
          castShadow
          position={[0, 200, 100]}
        />
      </>
    );
  }



  // const texture = useLoader(TextureLoader, 'grass_texture.jpg');
  // const Plane = (props) => {
  //   // if (texture) {
  //   //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //   //   texture.repeat.set(100, 100);
  //   //   texture.anisotropy = 16;
  //   // }
  //   const [ref] = usePlane(() => ({
  //     type: "Static",
  //     material: "ground",
  //     ...props
  //   }));
  //   return (
  //     <group>
  //       <mesh ref={ref} receiveShadow>
  //           <planeGeometry args={[30, 85]} />
  //           {/* {texture && <meshStandardMaterial color="green" />} */}
  //           <meshStandardMaterial/>
  //       </mesh>
  //     </group>
  //   );
  // };

  function Floor() {
    const [ref] = useBox(() => ({
      type: "Static",
      args: [25, 0.2, 25],
      mass: 0,
      material: {
        friction: 0,
        name: "floor",
      },
      collisionFilterGroup: 2,

    }));
    return (
      <group>
        <mesh ref={ref}>
          <boxGeometry name="floor-box" />
          <meshPhongMaterial opacity={0} transparent/>
        </mesh>
        <gridHelper args={[25, 25]} />
      </group>
    );
  }
  function Wall({ args, ...props }) {
    const [ref] = useBox(() => ({
      type: "Static",
      args,
      mass: 0,
      material: {
        friction: 0.3,
        name: "wall",
      },
      collisionFilterGroup: 2,
      ...props,
    }));
    return (
      <mesh receiveShadow ref={ref} {...props}>
        <boxGeometry args={args} />
        <meshPhongMaterial color="white" opacity={0.8} transparent />
      </mesh>
    );
  }



function AppGame(){ 
  const [action, setAction] = useState("StandingIdle")
  
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' });

return (
  <>
    <div style={{ height: "100vh", width: "100%" }}>
    
    <Canvas
        // flat
        camera={{
          fov: 50,
          near: 0.1,
          far: 500,
          position: [-0.2, 12, 45],
          
        }}
      >
          <ambientLight/>
          <pointLight position={[10, 10, 10]}/>
          <Suspense fallback={null}>
          <Environment background={"only"} files={process.env.PUBLIC_URL + "textures/bg.hdr"}/>            
          <Environment background={false} files={process.env.PUBLIC_URL + "textures/envmap.hdr"}/>
          <Physics allowSleep={false}>
          {/* <Float 
          speed={0.5}
          rotationIntensity={0.6}
          floatIntensity={0.6}> */}
             {/* <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} /> */}
             {debug && <Debug/>}
                <Target name="Target"/>
                <SwampModel name="swamp"/>
                <Model name="archer"/>
                 
                
             {/* <SceneParticles/> */}
             <RigidBody type="fixed" restitution={0.2} friction={0}>
              <mesh 
                castShadow 
                // args={[25, 10, 0.2]} 
                position={[0, 5, 38]} 
                name="Wall" 
                >
                <boxGeometry  args={[25, 10, 0.2]} />
                <meshStandardMaterial color="slategrey" wireframe/>
              </mesh>
              
              <mesh 
                castShadow 
                // args={[25, 10, 0.2]} 
                position={[0, 5, -36]} 
                name="Wall" 
                >
                <boxGeometry   args={[25, 10, 0.2]}  />
                <meshStandardMaterial color="slategrey"/>
              </mesh>

              <mesh
                name="Wall"
                castShadow
                // args={[75, 10, 0.2]}
                rotation={[0, -Math.PI / 2, 0]}
                position={[10, 5, 1]}
                >
                <boxGeometry args={[75, 10, 0.2]}/>
                <meshStandardMaterial color="slategrey"/>
              </mesh>

              <mesh
                name="Wall"
                castShadow
                // args={[75, 10, 0.2]}
                rotation={[0, -Math.PI / 2, 0]}
                position={[-7, 5, 1]}
                >
                <boxGeometry args={[75, 10, 0.2]} />
                <meshStandardMaterial color="slategrey"/>
              </mesh>
             </RigidBody>
                
                  
                  {/*tree.map((tree) => {
                    return <TreeModel position={tree.pos} rotation-y={tree.rotation}/>;
                  })}
                    {grass.map((grass) => {
                    return <GrassModel position={grass.pos} rotation-y={grass.rotation} key={Math.random()}/>;
                    })} */}
              {/* <Wall args={[25, 3, 0.2]} position={[0, 1.4, -12.6]} />
              <Wall args={[25, 3, 0.2]} position={[0, 1.4, 12.6]} />
              <Wall
                args={[25, 3, 0.2]}
                rotation={[0, -Math.PI / 2, 0]}
                position={[12.6, 1.4, 0]}
              />
              <Wall
                args={[25, 3, 0.2]}
                rotation={[0, -Math.PI / 2, 0]}
                position={[-12.6, 1.4, 0]}
              /> */}
              {/* <Wall args={[1, 4, 200]} position={[-100, 0, 0]} />
              <Wall args={[200, 4, 1]} position={[0, 0, -100]} />
              <Wall args={[1, 4, 200]} position={[100, 0, 0]} />
              <Wall args={[200, 4, 1]} position={[0, 0, 100]} /> */}
              
              {/* <Floor /> */}
              {/* <Ground/> */}
          {/* </Float> */}
          </Physics>
          </Suspense>
          <Lighting />
          {/* <Crosshair/> */}
          </Canvas>
      </div>
  
  </>
)


}

    return (
      <>
      
          
          <AppGame/>
        
      </>
    );
  }
  


export default Game;