import React, {useEffect, useState} from 'react';
import ColorPicker from './ColorPicker'
import { Button, Input,  Container, Row,Col, Label} from 'reactstrap';
 
import {useSelector, useDispatch} from 'react-redux'
import {selectors as SongMapperSelector, actions as SongMapperActions} from '../store/slices/songMapperSlice';
import MidiTracksTable from './MidiTracksTable'
import Renderer3D from '../3DRenderer'

const AppSettings  = (props) =>
{
  const currentMidiFile = useSelector(SongMapperSelector.getMidiUrl);
  const reduxNoteColors = useSelector(SongMapperSelector.getNoteColors);
  const [noteColors, setNoteColors] = useState([]);
  const dispatch = useDispatch();
  //console.log("Valore di reduxNoteColors:", reduxNoteColors);
  
  useEffect(()=>
  {
    console.log("Richiamato useEffect:", reduxNoteColors);
    setNoteColors([...reduxNoteColors]);
  },
  [reduxNoteColors])

  

  const saveSettings = (newNoteColors) => {


    console.log("Saving note colors to Redux!");
    dispatch(SongMapperActions.setNoteColors({noteColors:newNoteColors}))

    // Save colors to localStorage
    try {
      const serializedNoteColors = JSON.stringify(newNoteColors);
      localStorage.setItem('noteColors', serializedNoteColors);
    } catch {
      console.log("Error saving note colors to localStorage");
    }
  }

  const onColorChanged = (index) => (color) =>
  {
      console.log("Colore modificato");
      let newNoteColors = [...noteColors];
      newNoteColors[index] = color;
      saveSettings(newNoteColors);
  }


  const renderNoteColors = () =>
  {
    const defcolors = [ ["Do"],
                        ["Do#"],
                        ["Re"],
                        ["Re#"],
                        ["Mi"],
                        ["Fa"],
                        ["Fa#"],
                        ["Sol"],
                        ["Sol#"],
                        ["La"],
                        ["La#"],
                        ["Si"]
                        ];

     return defcolors.map((c,index)  => 
     {
         return(
       
            <div key={index} style={{color:"white", display:'flex', padding:'5px', 
            flexDirection: 'row', 
            width:'100px',
           justifyContent: 'space-between' }}>
                <Label  style={{margin:'5px'}}>{c[0]}</Label>
                {noteColors[index] && <ColorPicker color={noteColors[index]} 
                onColorChanged={onColorChanged(index)}/>}
            </div>
         )
     })
  }

  return (
   
   <Container style={{color:'white', margin:'10px' , width:'100%'}}>
    
       
     <Row>
       <Col sm={{ size: 2, order: 0, offset: 0 }}>
       <Row>
         <Col>
          <b>Note color</b>
         </Col>
        
         </Row>
         <Row>
         <div style={{height:'550px', padding:'5px', overflowY:"auto"}}>
           {renderNoteColors()}
            </div>
         </Row>
       </Col>
       
         <Col sm={{ size: 4, order: 0, offset: 0 }}>
         <Row>
         <b>Track Shape</b>
         </Row>
         <Row>
         <div style={{height:'550px', padding:'10px', overflowY:"auto"}}>
          <MidiTracksTable numTracks={10} />
        </div>
         </Row>
         </Col>
         <Col sm={{ size: 6, order: 0, offset: 0 }}>
           <Renderer3D store={props.store}/>
         </Col>
    </Row>      
             
  </Container>
    
  )
    
}

export default AppSettings;