//https://inspiring-wiles-b4ffe0.netlify.app/
//https://threejs.org/docs/
//https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md

//Camera handling
//https://stackoverflow.com/questions/59720627/moving-the-orthographic-camera-around-in-react-three-fiber

// HELPERS!
//https://github.com/pmndrs/drei

// Sky and mouse camera handling!!
//https://codesandbox.io/s/r3f-sky-m2ci7?file=/src/index.js

import React, { useRef, useState } from 'react'
import { Canvas, useFrame} from 'react-three-fiber'
import * as THREE from 'three';

import { useThree } from 'react-three-fiber'

function Dolly() {
  // This one makes the camera move in and out
  useFrame(({ clock, camera }) => {
    camera.position.x = 15 + Math.sin(clock.getElapsedTime()) * 10
    //camera.position.y = 15 + Math.sin(clock.getElapsedTime()) * 10
    camera.position.z = 15 + Math.sin(clock.getElapsedTime()) * 10
  })
  return null
}


function Special(props) {

  const {
    gl,                           // WebGL renderer
    scene,                        // Default scene
    camera,                       // Default camera
    size,                         // Bounds of the view (which stretches 100% and auto-adjusts)
    aspect,                       // Aspect ratio (size.width / size.height)
    mouse,                        // Current, centered, normalized 2D mouse coordinates
    //raycaster,                    // Internal raycaster instance
    clock,                        // THREE.Clock (useful for useFrame deltas)
    invalidate,
    intersect,
    setDefaultCamera,
    viewport,
    forceResize,
  } = useThree()
  
  // Reactive viewport bounds, will updated on resize
  const { width, height, factor, distance } = viewport
  // Viewport can also calculate precise bounds on demand!
  //const { width, height, factor, distance } = viewport(camera?: THREE.Camera, target?: THREE.Vector3)
  // Flags the canvas as "dirty" and forces a single frame
  // Use this to inform your canvas of changes when it is set to "invalidateFrameloop"
  invalidate()
  // Exchanges the default camera
  //setDefaultCamera(camera)
  // Trigger an intersect/raycast as well as event handlers that may respond
  //intersect(optionalEvent?: PointerEvent)
  // Force size/viewport recalculation
  forceResize()

  return (<mesh visible userData={{ test: "hello" }} position={[1.2, 1, 0.5]} rotation={[0, 0, 0]}>
  <sphereGeometry attach="geometry" args={[1, 16, 16]} />
  <meshStandardMaterial attach="material" color="indianred" transparent />
</mesh>)
}
function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [5.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {

  

  return (
    <Canvas style={{ background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> 
      <Dolly/>
    </Canvas>
  )
}