import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import { TextureLoader } from "three";
import {Line, Vector3} from "three";
import * as THREE from 'three'
import { useMemo } from "react";
import { Raycaster } from "three";
import { targetPositionState } from "../state/GameState";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { Sphere } from "@react-three/drei/core";


const useForwardRaycast = (obj) => {
    const raycaster = useMemo(() => new Raycaster(), [])
    const pos = useMemo(() => new Vector3(), [])
    const dir = useMemo(() => new Vector3(), [])
    // dir.set(0, -1 , 0)
    const scene = useThree((state) => state.scene)
    
    return () => {
      if (!obj.current) return []
      raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
    //   raycaster.set(obj.current.getWorldPosition(pos), dir)
      return raycaster.intersectObjects(scene.children)
    }
  }

const Crosshair = () => {
    const dot = useRef();
    const lines = useRef();
    const { camera } = useThree();

    const loader = new TextureLoader();
    const texture = loader.load("/textures/aimTarget.png");
    const raycaster = useForwardRaycast(dot)
    const raycast = new THREE.Raycaster();
    const {scene} = useThree();
    const [targetPosition, setTargetPosition] = useRecoilState(targetPositionState);
    const [color, setColor] = useState("")
    
    
    const pos2 =  new Vector3()
    const dir2 =  new Vector3()
    
    useFrame(({mouse}) => {
        const vector = new Vector3(0, 0, 0).unproject(camera);
        dot.current.position.set(...vector.toArray());
        var dir = camera.getWorldDirection(dir2);
        var pos = camera.getWorldPosition(pos2)

        raycast.set(pos, dir);
        var intersects = raycast.intersectObjects(scene.children);
        
        

        if(intersects.length > 0 && intersects[0].object.name== "Circle001_0"){
            setColor("red")
            console.log(intersects[0].object.name)
        }
        else{
            setColor("white")
        }

    })

    const Line = (props) => {
        const ref = useRef()

        useEffect(() => {
            if(ref.current){
                ref.current.geometry.setFromPoints([props.start, props.end].map((point) => new Vector3(...point)));
            }
        });

        return (
            <line ref={ref}>
                <bufferGeometry />
                <lineBasicMaterial />
            </line>
        )
    }

    return (
        <group>
            <group ref={lines}>
                <Line start={[0.05,0,0]} end={[0.18,0,0]} />
                <Line start={[0,0.05,0]} end={[0,0.18,0]} />
                <Line start={[-0.05,0,0]} end={[-0.18,0,0]} />
                <Line start={[0,-0.05,0]} end={[0,-0.18,0]} />
           </group>
            <mesh ref={dot}>
                <sphereGeometry args={[0.0004, 64, 32]}/>
                <meshBasicMaterial color={color} />
            </mesh>
                {/* <Sphere args={[0.0004, 64, 32]} ref={dot}>
                  <meshBasicMaterial color={color} />
                </Sphere> */}
        </group>
    )
}

export default Crosshair;