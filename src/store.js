import { configureStore, createSlice } from '@reduxjs/toolkit';

 
//https://redux-toolkit.js.org/tutorials/intermediate-tutorial


const midiSlice = createSlice({
    name: "midiSlice",
    initialState: {"testParam": 50},
    reducers: {
      increment: 
      {
          reducer(state,action)
          {
            state["testParam"] += action.payload.step
          },
          prepare(step){
            return {payload: {step}}
          }
         
      },
      
      midiOn: state => state,
      midiOff: state => state - 1
    }
  });

  //const { actions, reducer } = midiSlice
  const { increment } =  midiSlice.actions
 
const store = configureStore({
    reducer: midiSlice.reducer
  })
   console.log("Redux: Dispatch!!!");
  store.dispatch(increment(20));

export default store