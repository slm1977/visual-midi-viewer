import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import runAllSagas from './sagas'
import { rootReducer } from './reducers'

export const configureStore = (preloadedState: any) => {
    // const middlewares = [loggerMiddleware, thunkMiddleware]
  
    const sagaMiddleware = createSagaMiddleware()
    const middlewares: any = [sagaMiddleware]
  
    const middlewareEnhancer = applyMiddleware(...middlewares)
  
    // const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
    const enhancers = [middlewareEnhancer]
    const composedEnhancers = composeWithDevTools(...enhancers)
  
    const store = createStore(rootReducer, preloadedState, composedEnhancers)
  
    if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
      (module as any).hot.accept('./reducers', () => store.replaceReducer(rootReducer))
    }
  
    // then run the saga
    sagaMiddleware.run(runAllSagas)
  
    return store
  }


/*
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

*/