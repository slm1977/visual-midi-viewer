import React, { useState } from "react";
import { Canvas } from 'react-three-fiber';
import { Stars, TrackballControls, OrbitControls, MapControls } from '@react-three/drei'
import TracksRenderer from './components/trackShapes';
import MidiRenderer from './MidiRenderer';
//import { Controls, useControl } from "react-three-gui"
import { Provider } from 'react-redux'


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
          <Provider store={props.store}>
            <ambientLight intensity={1} color="0xFFFFFF"/>
              <directionalLight position={[-1, 2, 4]} intensity={1}/>
              <directionalLight position={[1, -1, -2]} intensity={1}/>
          
          <TracksRenderer songData={midiData} />

          <Stars />
          <OrbitControls />
          </Provider>
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '20%'}}>  
           <MidiRenderer onMidiLoaded={loadMidiData} onNoteEvent={updateNote} />)
      </div>

        </div>
      );
}

export default Renderer3D;


