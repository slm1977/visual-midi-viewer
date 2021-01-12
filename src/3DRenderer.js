

import React, { Suspense, useEffect, useRef} from "react";
import { Canvas, useFrame, useUpdate  } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls, Box, Cone } from '@react-three/drei'
import './styles.css'
import { Controls, useControl } from "react-three-gui"
import {connect, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit'

//Transform control
//https://codesandbox.io/s/r3f-drei-transformcontrols-hc8gm
//https://stackoverflow.com/questions/25797048/how-to-pass-in-a-react-component-into-another-react-component-to-transclude-the


// Redux toolkit example
//https://github.com/reduxjs/rtk-convert-todos-example/blob/master/src/features/todos/VisibleTodoList.js
//https://bmbarker90.github.io/selectors-presentation/#/11

const withAnimation = Component => ({ ...props}) => 
{
//const { camera } = useThree()
const shapeRef = useRef();

useFrame((state,delta) => {
    //shapeRef.current.rotation.y = shapeRef.current.rotation.y + 0.1;
        });

return(<Component ref={shapeRef} {...props}>
        </Component>)
} 


const Renderer3D =  function VisualRenderer3D(props) {
    
const AnimatedCone = withAnimation(Cone);
const AnimatedBox = withAnimation(Box);

const currentNote = useSelector(state => state.lastNote.noteNumber);

return(
  <div>
   
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
  <h2 style={{color:"white"}}>Ultima nota: {currentNote}</h2>
  </div>
);
}

 
const mapStateToProps = state =>
({
  lastNote : state["lastNote"]["noteNumber"]
})

export default Renderer3D;
//export default connect(mapStateToProps)(Renderer3D)
