import React, { useState } from "react";
import { Canvas } from 'react-three-fiber';
import { Stars,TrackballControls, MapControls, Plane } from '@react-three/drei'
import TracksRenderer from './components/trackShapes';
import MidiRenderer from './MidiRenderer';
//import { Controls, useControl } from "react-three-gui"
import { Provider } from 'react-redux'
import CubeView from 'react-cubeview';
//optional css file
//import 'react-cubeview/lib/css/react-cubeview.css';
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

   const updateAngles = (phi, theta) =>{
     console.log("Updating....", phi)
   }
    
    return(
        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '100%'}}>

        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '80%'}}>  
         {/* <CubeView 
            aspect={1} 
            hoverColor={0x0088FF} 
            cubeSize={2} 
            zoom={6} 
            antialias={true} 
            width={200}
            height={200}
        />
         */ }

        <Canvas colorManagement camera={{ position: [0, 0, 11], fov: 25 }}>
        
          
          <Provider store={props.store}>
            <ambientLight intensity={1} color="0xFFFFFF"/>
              <directionalLight position={[-1, 2, 4]} intensity={1}/>
              <directionalLight position={[1, -1, -2]} intensity={1}/>
          
          <TracksRenderer songData={midiData} />
          {/*<Plane args={[20, 20]} /> */}
          <Stars />
          <TrackballControls noRotate={false}/>
          </Provider>
          <axesHelper args={[20, 20,20]} />
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '20%'}}>  
           <MidiRenderer onMidiLoaded={loadMidiData} onNoteEvent={updateNote} />)
      </div>

        </div>
      );
}

export default Renderer3D;


