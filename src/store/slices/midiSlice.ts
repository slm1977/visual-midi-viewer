import { createSlice } from '@reduxjs/toolkit';


const currentSlice = createSlice({
    name: "midiSlice",
    initialState: { notes : Array.from(Array(20), () => new Array(128).fill(0))},
    reducers: {
      noteOn:
      (state, action) => {
          state.notes[action.payload.track-1][action.payload.noteNumber] = action.payload.velocity
      },

      noteOff:
      (state, action) => {
          state.notes[action.payload.track-1][action.payload.noteNumber] = 0
      },

      resetAll:
      (state,action) => {state.notes = Array.from(Array(20), () => new Array(128).fill(0))}
     } 
  });


  export const selectors = {
  //@audit-issue getNoteVelocity
    getNoteVelocity : (track :number, noteNumber: number) =>  (state: any) => 
    {  
     //console.log("Valore delle note001:", state);
     
      //console.log("Valore delle note traccia", (track));
       const res = state.midiReducer.notes[track][noteNumber];
       return res==null ? 0 : res;
    }
  }
  
   
 

// Extract the action creators object and the reducer
export const { actions, reducer }: any = currentSlice
 
