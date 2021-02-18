import { Box, Cone, Sphere, Torus, Cylinder, Tube,Ring, Tetrahedron, Polyhedron,
    Icosahedron, Octahedron, Dodecahedron  } from '@react-three/drei';

import * as THREE from 'three';


/* 
Midi Event example
{track: 15, delta: 16, tick: 660, byteIndex: 58, running: true, …}
byteIndex: 58
channel: 13
delta: 16
name: "Note on"
noteName: "E4"
noteNumber: 64
running: true
tick: 660
track: 15
velocity: 74
}
*/

export const availablePrimitivesDict = 
  {Box, Cone, Sphere, Torus, Cylinder, Ring,
   Tetrahedron,Icosahedron, Octahedron, Dodecahedron
  }

  const availablePrimitives0 = [Sphere];
  
export const availablePrimitives = 
  [Box, Cone, Sphere, Torus, Cylinder, Ring,
   Tetrahedron,Icosahedron, Octahedron, Dodecahedron, Cylinder, Sphere
  ]

const midi = (key) => `${process.env.PUBLIC_URL}/midi/${key}.mid`;
export const getMidiUrl = () =>
{
  const midiFile = "bachartefuga1";
  //const midiFile = "bach_brandenburg_concerto_1_1";
  //const midiFile = "bachwachauf";
  //const midiFile = "beethoven_opus10_1_format0"
  //const midiFile = "scalacromatica"; //"bachwachauf";
  return midi(midiFile);
}

 //@audit-issue getNotePosition
export const getNotePosition = (noteEvent) =>
{
  const note = noteEvent.noteNumber % 12;
  const octave = Math.floor(noteEvent.noteNumber/12) -1;
  const trackIndex = noteEvent.track;
  //console.log(`Track index: ${trackIndex}`)
  const noteDistanceFactor = 8;
  const octaveDistanceOffset = 5;
  const posX =  noteEvent.noteNumber*1
  const posY =  5*trackIndex;
  const posZ =  noteEvent.velocity/64
  //console.log("Position:",[posX,posY,posZ]);
  return [posX,posY,posZ] // [posX,(octave+1)*octaveDistanceOffset ,1]
}

export const getNoteScale = (noteEvent) =>
{
  const scaleValue = 10; //noteEvent.velocity/64;
  return [scaleValue,scaleValue,scaleValue];
}

export const getNoteRotation = (noteEvent) =>
{
  const rotationValue = noteEvent.velocity>0 ? 0.1 : 0;
  return [rotationValue,rotationValue,rotationValue];
}

// --------------------------------------------------------------
export const getNoteColorByIndex = (noteNumber,trackIndex) =>
{
  //console.log(`Note for color!!: ${noteNumber} -> Track_${trackIndex}`);
  const octave = Math.floor(noteNumber/12) -1;
  return new THREE.Color().setHSL(noteNumber /12, 1, .5);
}

export const getNoteColor = (noteEvent) =>
{
  const {noteNumber, track} = noteEvent;
  const note = noteNumber % 12;
   
  return getNoteColorByIndex(note, track-1);
} 

export const getDefaultTrackShape = (trackIndex) =>
{
  return availablePrimitives[trackIndex % availablePrimitives.length]
}