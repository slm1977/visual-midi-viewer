import { configureStore, createSlice } from '@reduxjs/toolkit';

 
//https://redux-toolkit.js.org/tutorials/intermediate-tutorial


const midiSlice = createSlice({
    name: "midiSlice",
    initialState: { "lastNote" :{ "noteNumber" : null , "vel" : null}},
    reducers: {
    
      noteOn:
      {
        reducer(state, action) {
          state["lastNote"] = {"noteNumber" : action.payload.value, "vel" : action.payload.velocity}
        },
        prepare(value,velocity){
            return {payload: {value,velocity}}
        }
      } ,
      noteOff:
      {
        reducer(state, action) {
          state["lastNote"] = {"noteNumber" : action.payload.value, "vel" : 0}
        },
        prepare(value){
            return {payload: {value}}
        }
      } 
    }
  });

  //const { actions, reducer } = midiSlice
  export const {  noteOn, noteOff } =  midiSlice.actions
 
const store = configureStore({
    reducer: midiSlice.reducer
  })
   console.log("Redux: Dispatch!!!");
    store.dispatch(noteOn(56,67));
    store.dispatch(noteOff(80));
export default store