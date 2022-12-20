import { Plane, Sphere, useGLTF } from "@react-three/drei";
import { Circle } from "@react-three/drei";


const HealthBar = () => {

    const model = useGLTF('/ErikaArcherWithAimingAnimations.glb');



    return (
        <>
            <Sphere args={[10,10]}>
                    <planeGeometry attach="geometry" args={[10, 10]} />
                    <meshStandardMaterial
                    attach="material"
                    color="orange"
                    emissive="#ff0860"
                    visible={true}
                    />
                    <primitive object={model.scene} scale={0.01}/>
            </Sphere>
        </>
    )
}

export default HealthBar;