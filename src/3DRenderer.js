import React, { useState, useEffect} from "react";
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { Stars,TrackballControls, MapControls, Plane } from '@react-three/drei'
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

const  Dolly = (props) => {
  // This one makes the camera move in and out
  useFrame(({ clock, camera }) => {
    camera.position.z = 50 + Math.sin(clock.getElapsedTime()) * 30
  })
  return null
}

const CameraManager = (props) => {

  const [resetRequest, setResetRequest] = useState(false);

  useEffect(()=>{
     if (!resetRequest && props.resetRequest) 
     {
       console.log("CameraManager USE EFFECT");
       setResetRequest(true);
       resetCameraPosition();
     }
  }, [props.resetRequest])
  
  const { scene, gl, size, camera } = useThree();
  const resetCameraPosition = () =>
  {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    
    props.onCameraReset();
    setResetRequest(false);
  }
   return null // <Button color="primary" onClick={() => resetCameraPosition()}>reset</Button>
}

const Renderer3D = (props) => {

  

  const noteEventRef = React.useRef();
  const [midiData, setmidiData] = useState({});
  const [cameraResetRequest, setCameraResetRequest] = useState(false)
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

     startRecording();
   }

   const updateAngles = (phi, theta) =>{
     console.log("Updating....", phi)
   }
    
    return(
        <div style={{borderStyle: "solid",  borderColor: "grey",
        'overflowY': 'auto', 'height': '500px'}}>

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

        <Canvas camera={{ position: [0, 0, 7.5] }} >
        
          
          <Provider store={props.store}>
            <ambientLight intensity={1} color="0xFFFFFF"/>
              <directionalLight position={[-1, 2, 4]} intensity={1}/>
              <directionalLight position={[1, -1, -2]} intensity={1}/>
              <pointLight color="indianred" />
              <pointLight position={[10, 10, -10]} color="orange" />
              <pointLight position={[-10, -10, 10]} color="lightblue" />
          <TracksRenderer songData={midiData} />
          {/*<Plane args={[20, 20]} /> */}
          <Stars />
          <TrackballControls noRotate={false}/>
          </Provider>
          <axesHelper args={[20, 20,20]} />
          <CameraManager resetRequest={cameraResetRequest} onCameraReset={() => setCameraResetRequest(false)}/>
        </Canvas>
        </div>
        <div style={{borderStyle: "solid",  borderColor: "grey", 'height': '20%'}}>  
        <Button onClick={() => setCameraResetRequest(true)}>Reset Camera</Button>
           <MidiRenderer onMidiLoaded={loadMidiData} onNoteEvent={updateNote} />)
      </div>

        </div>
      );
}

export default Renderer3D;


