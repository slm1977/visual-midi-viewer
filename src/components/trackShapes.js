import React, { useRef, useState } from "react";
import { useFrame } from 'react-three-fiber';
import {getNoteColor, getNotePosition, getNoteScale, getNoteRotation, getDefaultTrackShape, getNoteColorByIndex} from '../midi2shapesMapper';
import * as THREE from 'three';

const withAnimation = Component => ({ ...props}) => 
{

  //const { camera } = useThree()
  const shapeRef = useRef();
  const lastEventTick = useRef(-1);
  const isNoteOn = useRef(false);

  useFrame((state,delta) => {

  const {trackIndex,noteNumber, noteEventRef} = props;
  const infoEvent = noteEventRef;
 
  if (infoEvent==null || infoEvent.current==null || infoEvent.current.tick< lastEventTick.current) 
    {
      //console.log("INFO EVENT NULLO!!");
      return;
    }

    // se la nota è stata già spenta, non la riaccendo allo stesso tick
    // n.b: è un bug fix...da correggere
    if (lastEventTick==infoEvent.current.tick && !isNoteOn.current)
    { console.log(`Nota 3D ${noteNumber} già spenta, non la riattivo `); 
      return}
   
  const noteEvent = infoEvent.current.event;
  lastEventTick.current = noteEvent.tick;

  //console.log(`INFO EVENT OK su nota: ${noteEvent.noteNumber} vel: ${noteEvent.velocity} Track: ${noteEvent.track}`);
  if (noteNumber!=noteEvent.noteNumber || trackIndex!=(noteEvent.track-1 ))return;

    isNoteOn.current = noteEvent.name=="Note on" && noteEvent.velocity>0;
    console.log(`Nota 3D ${noteNumber} tick:${noteEvent.tick} attiva ? ${isNoteOn.current}`);
    /*
    console.log(`Shape position ${shapeRef.current.position.x} ${shapeRef.current.position.y} 
                ${shapeRef.current.position.z} trackIndex: ${trackIndex} evTrack: ${noteEvent.track}`)
    */
    //console.log(noteEvent);
    //shapeRef.current.material.opacity = 0.5;
    //shapeRef.current.material.transparent =  true;
    //shapeRef.current.materialside = THREE.DoubleSide;
    //shapeRef.current.material.color = getNoteColor(noteEvent);
    
    
    
    if (isNoteOn.current===true)
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
      console.log("Intercettato midi off!");
      shapeRef.current.scale.x = 0; //noteScale[0];
      shapeRef.current.scale.y = 0; //noteScale[1];
      shapeRef.current.scale.z = 0; //noteScale[2];
      
    }
  });
    
  return(<Component ref={shapeRef} {...props}>
          </Component>)
  
} 


/*
  const TrackRenderer = (props) => {
    
    const trackNotesRef = useRef([]);

    const {noteEventRef, trackIndex} = props;
    const envelopes = noteEventRef.envelope;
    return envelopes.map((envelope,index) => {
        ( envelope!=null &&
          <TrackShape trackIndex={index} key={index}
          noteEventRef={noteEventRef} 
           >
      <meshPhongMaterial attach="material" color="orange" />
      </TrackShape>
                
          )
    } );
  }
*/
  const TracksRenderer = (props) => {
    
    const filenameRef = useRef("");
    const trackShapesRef = useRef([]);

    const {config, songData, noteEventRef } = props;
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
     
    console.log(`Numero di trackShapes: ${trackShapesRef.current.length} noteEventRef:${noteEventRef.current}`);
      // render current track shapes
      return trackShapesRef.current.map((TrackShape, index) =>
      (
        // una TrackShape per ciascuna nota Midi
       
          <TrackShape                          
                trackIndex={Math.floor(index/128)} 
                noteNumber={index%128}
                key={index}
                noteEventRef={noteEventRef} 
                >
              <meshPhongMaterial attach="material" 
              opacity = {0.5} transparent={true}  
              side =  {THREE.DoubleSide}
              color={ getNoteColorByIndex(index%128, Math.floor(index/128))} />
          </TrackShape>
             
        ))
  }
 
  export default TracksRenderer; //React.memo(TracksRenderer);