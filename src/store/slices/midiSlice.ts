import { createSlice } from '@reduxjs/toolkit';


const currentSlice = createSlice({
    name: "midiSlice",
    initialState: { "notes" : Array.from(Array(20), () => new Array(128))},
    reducers: {
      noteOn:
      (state, action) => {
          state.notes[action.payload.track][action.payload.noteNumber] = action.payload.velocity
      },

      noteOff:
      (state, action) => {
          state.notes[action.payload.track as any][action.payload.noteNumber] = 0
      },
  
      
      } 
  });


  export const selectors = {
   
    getNoteVelocity : (track :number, noteNumber: number) =>  (state: any) => 
    {
       return state.midiSlice.notes[track][noteNumber];
    }
  }
  
   
 

// Extract the action creators object and the reducer
export const { actions, reducer }: any = currentSlice
 
