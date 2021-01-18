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

const availablePrimitives = 
  [Box, Cone, Sphere, Torus, Cylinder, Ring,
   Tetrahedron,Icosahedron, Octahedron, Dodecahedron
  ]

export const getMidiFilename = () =>
{
  //const midiFile = "bach_brandenburg_concerto_1_1";
  const midiFile = "bachwachauf";
  return midiFile;
}

export const getNotePosition = (noteEvent) =>
{
  const note = noteEvent.noteNumber % 12;
  const octave = Math.floor(noteEvent.noteNumber/12) -1;
  const trackIndex = noteEvent.track;

  const noteDistanceFactor = 8;
  const octaveDistanceOffset = 5;
  const posX = noteEvent.noteNumber /noteDistanceFactor +  trackIndex*5 ;

  return [posX,1,1] // [posX,(octave+1)*octaveDistanceOffset ,1]
}

export const getNoteColor = (noteEvent) =>
{
  const {noteNumber, track} = noteEvent;
  const note = noteNumber % 12;
  console.log(`Note for color!!: ${noteNumber} -> Track_${track}`);
  const octave = Math.floor(noteNumber/12) -1;
  return new THREE.Color().setHSL(note /12, 1, .5);
} 

export const getNoteRotation = (noteEvent) =>
{
  const rotationValue = noteEvent.name=="Note on" ? noteEvent.velocity/64 : 0;
  return [rotationValue,rotationValue,rotationValue];
}

export const getDefaultTrackShape = (trackIndex) =>
{
  return availablePrimitives[trackIndex % availablePrimitives.length]
}