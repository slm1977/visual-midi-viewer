import React, { useState } from "react";
import { Canvas, render, useFrame, useUpdate  } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls } from '@react-three/drei'
import TracksRenderer from './components/trackShapes';
import MidiRenderer from './MidiRenderer';
//import { Controls, useControl } from "react-three-gui"

const Renderer3D = (props) => {

  const noteEventRef = React.useRef();
  const [midiData, setmidiData] = useState({});

  const updateNote = (infoEvent) => {
      console.log(`Ultimo evento in 3Drenderer: ${infoEvent}`);
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
        <ambientLight intensity={1} color="0xFFFFFF"/>
          <directionalLight position={[-1, 2, 4]} intensity={1}/>
          <directionalLight position={[1, -1, -2]} intensity={1}/>

          <TracksRenderer songData={midiData} noteEventRef={noteEventRef} />

          <Stars />
          <OrbitControls />
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '20%'}}>  
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


