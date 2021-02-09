import { createSlice } from '@reduxjs/toolkit';


const currentSlice = createSlice({
    name: "songMapperSlice",
    initialState: { midiUrl:"" , trackShape : [] as any , noteColor:{} as any},
    reducers: {

      setMidiUrl:
      (state,action) => {
        state.midiUrl = action.payload.midiUrl;
      },

      setTrackShape:
      (state, action) => {
          state.trackShape[action.payload.track-1] = action.payload.shape
      },

      setNoteColor:
      (state, action) => {
          state.noteColor[action.payload.noteName] = action.payload.color;
      }
    } 
  });


  export const selectors = {

    getMidiUrl :(state: any) => {
      return state.songMapperReducer.midiUrl;
    },
  
    getTrackShape: (track : number) =>  (state: any) => 
    {  
     
      //console.log("Valore delle note traccia", (track));
       return state.songMapperReducer.notes[track-1];
    },

    getNoteColor: (noteNumber : number) =>  (state: any) => 
      {  
        return state.songMapperReducer.noteColor[noteNumber];
      }
  }
  
// Extract the action creators object and the reducer
export const { actions, reducer }: any = currentSlice
 
