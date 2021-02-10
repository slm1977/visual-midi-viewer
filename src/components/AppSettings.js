import React, {useEffect, useState} from 'react';
import ColorPicker from './ColorPicker'
import { Button, Input,  Modal, ModalHeader, ModalBody, ModalFooter, 
          Label,Form, FormFeedback, FormGroup} from 'reactstrap';
 
import {useSelector, useDispatch} from 'react-redux'
import {selectors as SongMapperSelector, actions as SongMapperActions} from '../store/slices/songMapperSlice';
 

const SettingsModal = (props) =>
{
  const currentMidiFile = useSelector(SongMapperSelector.getMidiUrl);
  const reduxNoteColors = useSelector(SongMapperSelector.getNoteColors);
  const [noteColors, setNoteColors] = useState([]);
  const dispatch = useDispatch();
  console.log("Valore di reduxNoteColors:", reduxNoteColors);
  
  useEffect(()=>
  {
    console.log("Richiamato useEffect:", reduxNoteColors);
    setNoteColors([...reduxNoteColors]);
  },
  [reduxNoteColors])

  const saveSettings = () => {


    console.log("Saving note colors to Redux!");
    dispatch(SongMapperActions.setNoteColors({noteColors}))

    // Save colors to localStorage
    try {
      const serializedNoteColors = JSON.stringify(noteColors);
      localStorage.setItem('noteColors', serializedNoteColors);
    } catch {
      console.log("Error saving note colors to localStorage");
    }

    props.onCloseSettings();
  }

  const ignoreSettings = () => {
        setNoteColors(reduxNoteColors);
        props.onCloseSettings();
  }

  const onColorChanged = (index) => (color) =>
  {
      console.log("Colore modificato");
      let newNoteColors = [...noteColors];
      newNoteColors[index] = color;
      setNoteColors(newNoteColors);
      
  }

  const renderTrackShapes = () => {
   return null;
   /*
   (<option value="1">1 ora</option>
   <option value="2">2 ore</option>)
    */
  }

  const renderNoteColors = () =>
  {
    const defcolors = [ ["Do",'rgb(55,120,40)'],
                        ["Do#",'rgb(55,120,40)'],
                        ["Re",'rgb(55,120,40)'],
                        ["Re#",'rgb(55,120,40)'],
                        ["Mi",'rgb(55,120,40)'],
                        ["Fa",'rgb(55,120,40)'],
                        ["Fa#",'rgb(55,120,40)'],
                        ["Sol",'rgb(55,120,40)'],
                        ["Sol#",'rgb(55,120,40)'],
                        ["La",'rgb(55,120,40)'],
                        ["La#",'rgb(55,120,40)'],
                        ["Si",'rgb(55,120,40)']
                        ];

     return defcolors.map((c,index)  => 
     {
         return(
       
            <div style={{display:'flex', padding:'5px', flexDirection: 'row', 
            width:'100px',
           justifyContent: 'space-between' }}>
                <Label style={{margin:'5px'}}>{c[0]}</Label>
                <ColorPicker key={index} color={noteColors[index] || c[1]} onColorChanged={onColorChanged(index)}/>
            </div>
         )
     })
  }

  return <Modal isOpen={props.isOpen}>

      <ModalHeader>Visual Midi 3D Viewer Settings</ModalHeader>
      <ModalBody>
        <Form>
      <FormGroup>
                <Label for="txtMidiFile">
                    <b>Midi File Url!!!</b>
                    </Label>
                     <Input id="txtMidiFile"  type="text" 
                     valid={true} 
                     invalid={false} 
                     value={currentMidiFile} 
                     onChange={() => console.log("On Change")}/>
              <FormFeedback>Campo obbligatorio</FormFeedback>
              </FormGroup>
          </Form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20 }}>
        <div><b>Note color</b></div>
        <div><b>Track shape</b></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20 }}>
      <div style={{height:'200px', overflowY:"scroll"}}>
             {renderNoteColors()}
            </div>
       
        <div>
          <Input id="selectDuration" 
                     
                    value={`Cube`}
                    type="select">
                   {renderTrackShapes()}
              </Input> 
        </div>
      </div>
            
           
       
      </ModalBody>
      <ModalFooter>
      <Button color="primary" onClick={saveSettings}>Ok</Button>{' '}
              <Button color="secondary" onClick={ignoreSettings}>Cancel</Button>
      </ModalFooter>
  </Modal>
    
}

export default SettingsModal;