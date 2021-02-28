import React, { useState, useEffect} from "react";
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { Stars,TrackballControls, OrbitControls, MapControls, Plane } from '@react-three/drei'
import TracksRenderer from './components/trackShapes';
import MidiRenderer from './MidiRenderer';
//import { Controls, useControl } from "react-three-gui"
import { Provider } from 'react-redux'
import { Button } from 'reactstrap';
//import CubeView from 'react-cubeview';
//import { CanvasRecorder } from '@tawaship/canvas-recorder';
//import * as recordScreen from 'record-screen';

//optional css file
//import 'react-cubeview/lib/css/react-cubeview.css';


const Renderer3D = (props) => {

  
  const controlsRef  = React.useRef(); 
  const noteEventRef = React.useRef();
  const [midiData, setmidiData] = useState({});
  const canvasRef = React.useRef();

  const startRecording =  ()=> {
    console.log("Start recording on:", canvasRef.current);
    /*
    CanvasRecorder.createAsync(canvasRef.current)
    .then(recorder => {
        recorder.start();
        setTimeout(()=> {
            recorder.finishAsync()
                .then(movie => {
                  console.log("Movie realizzato:", movie);
                    movie.download();
                });
        }, 20000);
    });
    */
  }

  

  const updateNote = (infoEvent) => {
      //console.log(`Ultimo evento in 3Drenderer: ${infoEvent}`);
      //console.log(infoEvent);
      noteEventRef.current = infoEvent;
    }


   const loadMidiData = (midiData) =>
   {
     console.log("midi data loaded: setting state...");
     setmidiData(midiData);

     //startRecording();
   }

    return(
        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '600px'}}>

        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '80%'}}>  
        
        <Canvas camera={{ position: [0, 0, 7.5] }} >
        
          
          <Provider store={props.store}>
            {
              /*
            <ambientLight intensity={1} color="0xFFFFFF"/>
             */}
            <directionalLight position={[-1, 2, 4]} intensity={1}/>
            <directionalLight position={[1, -1, -2]} intensity={1}/>
           
              <pointLight color="indianred" />
              <pointLight position={[10, 10, -10]} color="orange" />
              <pointLight position={[-10, -10, 10]} color="lightblue" />
          <TracksRenderer songData={midiData} />
          {/*<Plane args={[20, 20]} /> */}
          <Stars />
          
          <OrbitControls ref={controlsRef}/>
          
          </Provider>
          <axesHelper args={[20, 20,20]} />
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '10%'}}>  
        <Button size="sm" onClick={() => controlsRef.current.reset()}>Reset </Button>
        <Button size="sm" onClick={() => controlsRef.current.saveState()}>Memo </Button>
           <MidiRenderer onMidiLoaded={loadMidiData} onNoteEvent={updateNote} />
      </div>

        </div>
      );
}

export default Renderer3D;


