import { combineReducers } from 'redux'
import { reducer as midiReducer } from './slices/midiSlice'
import { reducer as songMapperReducer } from './slices/songMapperSlice'


export const rootReducer  = combineReducers({
    midiReducer: midiReducer,
    songMapperReducer: songMapperReducer
  })