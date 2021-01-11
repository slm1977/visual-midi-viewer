

import React, { Suspense, useEffect, useRef} from "react";
import { Canvas, useFrame, useUpdate  } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls, Box, Cone } from '@react-three/drei'
import './styles.css'
import { Controls, useControl } from "react-three-gui"
//Transform control
//https://codesandbox.io/s/r3f-drei-transformcontrols-hc8gm
//https://stackoverflow.com/questions/25797048/how-to-pass-in-a-react-component-into-another-react-component-to-transclude-the

const withAnimation = Component => ({ ...props}) => 
{
//const { camera } = useThree()
const shapeRef = useRef();

useFrame((state,delta) => {
    shapeRef.current.rotation.y = shapeRef.current.rotation.y + 0.1;
    //.update(delta)
        });

return(<Component ref={shapeRef} {...props}>
        </Component>)
} 

export default function App(props) {
    
const AnimatedCone = withAnimation(Cone);
const AnimatedBox = withAnimation(Box);
return(
  <Canvas colorManagement camera={{ position: [0, 0, 11], fov: 25 }}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <AnimatedBox>
      <meshStandardMaterial attach="material" color="orange" />
    </AnimatedBox>

    <Cone position={[1,1,2]}>
      <meshStandardMaterial  attach="material" color="red" />
    </Cone>
    <AnimatedCone  position={[1,3,5]}>
        <meshStandardMaterial  attach="material" color="green" />
    </AnimatedCone> 
    <Stars />
    <OrbitControls />
  </Canvas>
);
}
