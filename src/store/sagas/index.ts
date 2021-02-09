import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects'
//import { sagas as appointmentsSagas } from './appointments_notification'
import {actions as SongMapperActions} from "../slices/songMapperSlice";



function* runAllSagas() {
  console.log('in root saga')
  yield all([
    //appointmentsSagas(),
    yield call(loadState)
  ])
}

function* loadState ()
{
  console.log("Chiamata loadState");
  const noteColors = localStorage.getItem("noteColors");
  if (noteColors!=null)
  {
    const deserializedNoteColors = JSON.parse(noteColors);
    yield put(SongMapperActions.setNoteColors({"noteColors": deserializedNoteColors}))
  }
  
}

export default runAllSagas;