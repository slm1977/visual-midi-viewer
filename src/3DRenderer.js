

import React, { Suspense, useEffect, useRef} from "react";
import { Canvas, useFrame, useUpdate  } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls, Box, Cone } from '@react-three/drei'
import './styles.css'
import { Controls, useControl } from "react-three-gui"
//Transform control
//https://codesandbox.io/s/r3f-drei-transformcontrols-hc8gm

function AnimatedCone (props) 
{
//const { camera } = useThree()
const noteCone = useRef();

useFrame((state,delta) => {
    noteCone.current.rotation.y = noteCone.current.rotation.y + 0.1;
    //.update(delta)
        });

return(<Cone ref={noteCone} {...props}>
    <meshStandardMaterial  attach="material" color="green" />
</Cone>)
} 

export default function App(props) {
return(
  <Canvas colorManagement camera={{ position: [0, 0, 11], fov: 25 }}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box>
      <meshStandardMaterial attach="material" color="orange" />
    </Box>

    <Cone position={[1,1,2]}>
      <meshStandardMaterial  attach="material" color="red" />
    </Cone>
    <AnimatedCone  position={[1,3,5]}/> 
    <Stars />
    <OrbitControls />
  </Canvas>
);
}
