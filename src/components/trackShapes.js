
import React, { useRef, useState } from "react";
import { useFrame } from 'react-three-fiber';
import {getNoteColor, getNotePosition, getNoteRotation, getDefaultTrackShape} from '../midi2shapesMapper';


const withAnimation = Component => ({ ...props}) => 
{

//const { camera } = useThree()
const shapeRef = useRef();
const shapeVisible = useRef(false);
const isNoteOn = useRef(false);

useFrame((state,delta) => {
 
  const {trackIndex, noteEventRef} = props;
  const infoEvent = noteEventRef;
 

  if (infoEvent==null ||infoEvent.current==null ) return;
  
  const noteEvent = infoEvent.current.event;
 

    //console.log(`Valore Ref di last Note da Animated: ${noteEvent} Track Event: ${noteEvent.track}`);
    //console.log(noteEvent);
    //console.log(`Valore di material: ${shapeRef.current.material.color}`);
    //console.log(shapeRef.current.material.color);
    
    if (trackIndex==noteEvent.track)
    {
        isNoteOn.current = noteEvent.name=="Note on" && noteEvent.velocity>0;
        shapeVisible.current = true;


        console.log(`Shape position ${shapeRef.current.position.x} ${shapeRef.current.position.y} 
                    ${shapeRef.current.position.z} trackIndex: ${trackIndex} evTrack: ${noteEvent.track}`)
        
        console.log(noteEvent);
        shapeRef.current.material.opacity = 0.5;
        shapeRef.current.material.transparent =  true;
        
        shapeRef.current.material.color = getNoteColor(noteEvent);
        
        const noteRotation = getNoteRotation(noteEvent);
        shapeRef.current.scale.x = noteRotation[0];
        shapeRef.current.scale.y = noteRotation[1];
        shapeRef.current.scale.z = noteRotation[2];
        
        if (isNoteOn.current)
        {  
            const notePosition = getNotePosition(noteEvent);
            shapeRef.current.position.x = notePosition[0];
            shapeRef.current.position.y = notePosition[1];
            shapeRef.current.position.z = notePosition[2];
            shapeRef.current.rotation.y += 0.1;
        }  
    }
    
    });
    
        return(<Component scale={[0,0,0]} ref={shapeRef} {...props}>
                </Component>)
       
} 

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

        console.log(`Note Event Ref: ${noteEventRef}`);
        let trackShapes = [];
    
        for (let i=0;i<numTracks; i++)
        {   
            const trackShape = (config!=null && config.shapes!=null && config.shapes[i]!=null) ?
                 React.memo(withAnimation(config.shapes[i])) : 
                 React.memo(withAnimation(getDefaultTrackShape(i)));
                 trackShapes.push(trackShape);
        }
        // Update the ref to track shapes
        trackShapesRef.current = trackShapes;
    }
   
      // render current track shapes
      return trackShapesRef.current.map((TrackShape, index) =>
      (
        <TrackShape                          trackIndex={index} 
                                              key={index}
                                              noteEventRef={noteEventRef} 
                                               >
        <meshPhongMaterial attach="material" color="orange" />
      </TrackShape>
      )
      )
  }
 
  export default TracksRenderer; //React.memo(TracksRenderer);