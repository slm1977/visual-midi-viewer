import {configureStore, combineReducers} from '@reduxjs/toolkit';
import { reducer as midiReducer } from './slices/midiSlice'
import { reducer as songMapperReducer } from './slices/songMapperSlice'


const rootReducer = combineReducers({midiReducer, songMapperReducer});

const store = configureStore({
    reducer: rootReducer
  })

  if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
    (module as any).hot.accept('./', () => store.replaceReducer(rootReducer))
  }
  
export default store