

import React, { Suspense, useEffect, useRef, useState, useCallback, useMemo} from "react";
import { Canvas, render, useFrame, useUpdate  } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls, Box, Cone } from '@react-three/drei'
//import { Controls, useControl } from "react-three-gui"
import * as THREE from 'three';

import MidiRenderer from './MidiRenderer';

//Transform control
//https://codesandbox.io/s/r3f-drei-transformcontrols-hc8gm
//https://stackoverflow.com/questions/25797048/how-to-pass-in-a-react-component-into-another-react-component-to-transclude-the

//Shape Positions
//https://inspiring-wiles-b4ffe0.netlify.app/2-objects-and-properties

// Redux toolkit example
//https://github.com/reduxjs/rtk-convert-todos-example/blob/master/src/features/todos/VisibleTodoList.js
//https://bmbarker90.github.io/selectors-presentation/#/11


const withAnimation = Component => ({ ...props}) => 
{

//const { camera } = useThree()
const shapeRef = useRef();


useFrame((state,delta) => {
 
  const infoEvent = props.noteRef;
  //console.log("Informazione");
  //console.log(infoEvent);S
  if (infoEvent==null ||infoEvent.current==null ) return;
  const note = infoEvent.current.event.noteNumber;

    //console.log(`Valore Ref di last Note da Animated: ${props.noteRef.current}`);
    //console.log(`Valore di material: ${shapeRef.current.material.color}`);
    //console.log(shapeRef.current.material.color);
    
      
      if (note && note%2==0)
      {
        shapeRef.current.material.color = new THREE.Color('indianred');
        shapeRef.current.rotation.y = shapeRef.current.rotation.y + 0.1;
      }
     
      else
      {
        shapeRef.current.material.color = new THREE.Color('orange');
        shapeRef.current.rotation.y = shapeRef.current.rotation.y - 0.1;
      }
       
    });

      

return(<Component ref={shapeRef} {...props}>
        </Component>)
} 

//https://javascript.info/object#computed-properties
//const componentName = "AnimatedCone";
const AnimatedCone = React.memo(withAnimation(Cone));
const AnimatedBox = React.memo(withAnimation(Box));

//https://levelup.gitconnected.com/react-refs-for-function-components-44f1a5a2332a

const Renderer3D = (props) => {

  const noteEventRef = React.useRef();
  const [midiData, setmidiData] = useState({});

  const updateNote = (infoEvent) => {
      //console.log(`Ultimo evento in 3Drenderer: ${infoEvent}`);
      //console.log(infoEvent);
      noteEventRef.current = infoEvent;
    }

   const loadMidiData = (midiData) =>
   {
     console.log("midi data loaded: setting state...");
     setmidiData(midiData);
   }
    
    return(
        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '100%'}}>
        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '80%'}}> 
        <Canvas colorManagement camera={{ position: [0, 0, 11], fov: 25 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]}/>
          <AnimatedBox noteRef={noteEventRef} songData={midiData}>
            <meshStandardMaterial attach="material" color="orange" />
          </AnimatedBox>
          <AnimatedCone noteRef={noteEventRef} songData={midiData}>
            <meshStandardMaterial attach="material" color="green" />
          </AnimatedCone>
          <Stars />
          <OrbitControls />
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '20%'}}> >
           <MidiRenderer onMidiLoaded={loadMidiData} onNoteEvent={updateNote} />)
      </div>

        </div>
      );
}

export default Renderer3D;

 /*

 //import {connect, useSelector } from 'react-redux';
//import { createSelector } from '@reduxjs/toolkit'
const mapStateToProps = state =>
({
  lastNote : state["lastNote"]["noteNumber"]
})
//export default connect(mapStateToProps)(Renderer3D)
*/


