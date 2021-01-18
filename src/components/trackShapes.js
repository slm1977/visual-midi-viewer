import * as THREE from 'three';
import React, { useRef } from "react";
import { useFrame } from 'react-three-fiber';
import { Box, Cone, Sphere } from '@react-three/drei'


const withAnimation = Component => ({ ...props}) => 
{

//const { camera } = useThree()
const shapeRef = useRef();


useFrame((state,delta) => {
 
  const infoEvent = props.noteRef;
  if (infoEvent==null ||infoEvent.current==null ) return;
  const note = infoEvent.current.event.noteNumber;

    console.log(`Valore Ref di last Note da Animated: ${props.noteRef.current}`);
    //console.log(`Valore di material: ${shapeRef.current.material.color}`);
    //console.log(shapeRef.current.material.color);
    
    const color = props.trackIndex==0 ? new THREE.Color().setHSL(7 / 8, 1, .5) : 
                                        new THREE.Color().setHSL(4 / 8, 1, .5);
   console.log(`Shape position ${shapeRef.current.position.x} ${shapeRef.current.position.y} ${shapeRef.current.position.z}`)
    shapeRef.current.material.opacity = 0.5;
    shapeRef.current.material.transparent = props.trackIndex==0 ? true : false;
      if (note && note%2==0)
      { 
        shapeRef.current.material.color = color;
        shapeRef.current.rotation.y = shapeRef.current.rotation.y + 0.1;
      }
     
      else
      {
        shapeRef.current.material.color = color;
        shapeRef.current.rotation.y = shapeRef.current.rotation.y - 0.1;
      }
       
    });

return(<Component ref={shapeRef} {...props}>
        </Component>)
} 

/*
const TrackShape = (props) => {


    const MyShape = (props.trackIndex!=null &&
                    props.trackIndex>=0 && props.trackIndex<tracks.length) ? 
                    tracks[props.trackIndex] : React.memo(withAnimation(Box));
    
    return <MyShape {...props} />
  }
*/
  const TracksRenderer = (props) => {
    
    const {shapes, songData, noteEventRef } = props;
    // If are not midi data available, I have to render null
    if (songData==null) return;
    console.log(`Note Event Ref: ${noteEventRef}`);
    let trackShapes = null;
    if (shapes!=null)
    trackShapes = shapes.map((shape, index) => React.memo(withAnimation(shape)));
    else
    trackShapes = [React.memo(withAnimation(Cone)), React.memo(withAnimation(Box))]; 

      return trackShapes.map((TrackShape, index) =>
      (
        <TrackShape position={[index*2,0,0]}  trackIndex={index} 
                                              key={index}
                                              noteRef={noteEventRef} 
                                               >
        <meshPhongMaterial attach="material" color="orange" />
      </TrackShape>
      )
      )
  }
 
  export default TracksRenderer; //React.memo(TracksRenderer);