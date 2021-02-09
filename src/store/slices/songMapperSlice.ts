import { createSlice } from '@reduxjs/toolkit';


const currentSlice = createSlice({
    name: "songMapperSlice",
    initialState: { midiUrl:"" , trackShapes : [] as any , noteColors:{} as any},
    reducers: {

      setMidiUrl:
      (state,action) => {
        state.midiUrl = action.payload.midiUrl;
      },

      setTrackShapes:
      (state, action) => {
          state.trackShapes = action.payload.trackShapes
      },

      setTrackShape:
      (state, action) => {
          state.trackShapes[action.payload.track-1] = action.payload.trackShape
      },

      setNoteColors:
      (state, action) => {
          state.noteColors  = action.payload.noteColors;
      },

      setNoteColor:
      (state, action) => {
          state.noteColors[action.payload.noteName] = action.payload.noteColors;
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
       return state.songMapperReducer.trackShapes[track-1];
    },

    getTrackShapes:(state: any) => 
    {  
     
      //console.log("Valore delle note traccia", (track));
       return state.songMapperReducer.trackShapes;
    },

    getNoteColor: (noteNumber : number) =>  (state: any) => 
      {  
        return state.songMapperReducer.noteColor[noteNumber];
      },

      getNoteColors: (state: any) => 
      {  
        return state.songMapperReducer.noteColors;
      }
  }
  
// Extract the action creators object and the reducer
export const { actions, reducer }: any = currentSlice
 
