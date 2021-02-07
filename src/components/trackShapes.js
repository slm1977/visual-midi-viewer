import React, { useRef, useState } from "react";
import { useFrame } from 'react-three-fiber';
import {getNoteColor, getNotePosition, getNoteScale, getNoteRotation, getDefaultTrackShape, getNoteColorByIndex} from '../midi2shapesMapper';
import * as THREE from 'three';

import { useSelector } from 'react-redux';
import {selectors as MidiSelector} from '../store/slices/midiSlice';

const withAnimation = Component => ({ ...props}) => 
{

  //const { camera } = useThree()
  const shapeRef = useRef();

  const {trackIndex,noteNumber} = props;

  

  const noteVelocity = useSelector(MidiSelector.getNoteVelocity(trackIndex, noteNumber));
  const noteEvent = {noteNumber, track:trackIndex, velocity: noteVelocity} ;
  //console.log(`Note selector velocity--> ${noteVelocity}`);

  useFrame((state,delta) => {
        //console.log("Chiamato useFrame!");
        if (shapeRef.current==null) return;

      if (noteVelocity>0)
          {  
            const noteScale = getNoteScale(noteEvent);
              shapeRef.current.scale.x = noteScale[0];
              shapeRef.current.scale.y = noteScale[1];
              shapeRef.current.scale.z = noteScale[2];

              const notePosition = getNotePosition(noteEvent);
              shapeRef.current.position.x = notePosition[0];
              shapeRef.current.position.y = notePosition[1];
              shapeRef.current.position.z = notePosition[2];

              shapeRef.current.rotation.x += getNoteRotation(noteEvent)[0];
              shapeRef.current.rotation.y += getNoteRotation(noteEvent)[1];
              shapeRef.current.rotation.z += getNoteRotation(noteEvent)[2];
          }  
          else
          {
            //console.log("Intercettato midi off!");
            shapeRef.current.scale.x = 0; //noteScale[0];
            shapeRef.current.scale.y = 0; //noteScale[1];
            shapeRef.current.scale.z = 0; //noteScale[2];
            
          }
  });
    
  return(<Component ref={shapeRef} {...props}>
          </Component>)
  
} 


  const TracksRenderer = (props) => {
    
    const filenameRef = useRef("");
    const trackShapesRef = useRef([]);

    //const testS = useSelector(MidiSelector.getNoteVelocity(3, 48));
    //console.log("NoteSelector:", testS);

    const {config, songData } = props;
    // If are not midi data available, I have to render null
    if (songData==null) return;
    
    const {numTracks, instruments, fileName} = songData;

    // if midi file was changed, recreate Track Shapes
    if (filenameRef.current!=fileName)
    {
        filenameRef.current = fileName;
        let trackShapes = [];
       // create a TrackRenderer for each midi track
       console.log("Creazione dei TrackShapes");
        for (let i=0;i<numTracks; i++)
        {   
          //one Shape for each midi note for each midi track
          for (let j=0;j<128;j++)
          {
            const trackShape = (config!=null && config.shapes!=null && config.shapes[i]!=null) ?
            React.memo(withAnimation(config.shapes[i])) : 
            React.memo(withAnimation(getDefaultTrackShape(i)));
            trackShapes.push(trackShape);
          }
          
        }
        // Update the ref to track shapes
        trackShapesRef.current = trackShapes;
    }
     
    // render current track shapes
  
      return trackShapesRef.current.map((TrackShape, index) =>
      (
        // una TrackShape per ciascuna nota Midi
       
          <TrackShape                          
                trackIndex={Math.floor(index/128)} 
                noteNumber={index%128}
                key={index}
                >
              <meshPhongMaterial attach="material" 
              opacity = {0.5} transparent={true}  
              side =  {THREE.DoubleSide}
              color={ getNoteColorByIndex(index%128, Math.floor(index/128))} />
          </TrackShape>
             
        ))
  }
 
  export default TracksRenderer; //React.memo(TracksRenderer);