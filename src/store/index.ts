import {configureStore, combineReducers} from '@reduxjs/toolkit';
import { reducer as midiSlice } from './slices/midiSlice'

const store = configureStore({
    reducer: combineReducers([midiSlice.reducer])
  })
  
export default store