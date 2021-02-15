
import React, {useRef} from "react";
import {AiFillFolderOpen} from 'react-icons/ai';
import { IconContext } from "react-icons";
import IconButton from '@material-ui/core/IconButton';
import fileToArrayBuffer from 'file-to-array-buffer';

const MidiFilePicker = (props) => {
  
  const inputRef = useRef();

  const fileUploadInputChange = async (event) =>
  {
   console.log("Selected:", typeof(event.target.files[0]));
   const data = await fileToArrayBuffer(event.target.files[0])
   props.onFileLoaded(data);
  }

  return <>
    <input accept={[".mid",".midi"]} type="file" hidden ref={inputRef} onChange={(e) => fileUploadInputChange(e)}/>
    <IconButton  onClick={() => inputRef.current.click()} >
                <IconContext.Provider value={{ color:  `white`, 
                                              className: "global-class-name" , size: "0.5em"}}>
                    <AiFillFolderOpen data-place="top" data-tip={"Open midi file"} />
                </IconContext.Provider>
        </IconButton>
  </>
}

export default MidiFilePicker;