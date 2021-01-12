import React, { Component } from 'react';
import {Input, Label} from 'reactstrap';
import './App.css';
import MIDISounds from 'midi-sounds-react';
import MidiPlayer from "midi-player-js";
import axios from "axios";
import {noteOn, noteOff} from "./store";
import {connect} from 'react-redux';
//https://github.com/reduxjs/rtk-convert-todos-example

//https://github.com/surikov/midi-sounds-react-examples/blob/master/examples/midi-sounds-example10/src/App.js

//http://grimmdude.com/MidiPlayerJS/docs/Player.html#getTotalEvents

// Midi and Redux
//https://elenatorro.com/jsday-2017-talk/
//https://react-redux.js.org/using-react-redux/connect-mapdispatch

const midi = (key) => `${process.env.PUBLIC_URL}/midi/${key}.mid`;
const loadMidi = async (url) => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return data;
};

class App extends Component {

  constructor(props)
  {
    super(props);
    console.log("START");
    console.log(props);
    this.state = {fileReady: false,
                  // instruments to be loaded
                  instruments:[], 
                  // instrument related to each Midi Channel
                  channelInstrument: Array.from({length: 16}, (_, i) => 0),
                  // note envelopes for each note and each track
                  envelopes: null //Array.from(Array(20), () => new Array(128)) // 16 tracks with 128 different notes available
                  };
  }

  


 async componentDidMount()
 {
   // Initialize player and register event handler
   this.midiPlayer = new MidiPlayer.Player(this.handleMidiEvents);
  await this.loadMidi();
 }

 loadMidi = async () =>
 {
     
    // Load a MIDI file
    //console.log(Player);
    this.midiPlayer.loadArrayBuffer(await loadMidi(midi("bach_brandenburg_concerto_1_1")));
    const {instruments} = this.midiPlayer;
    console.log("Lista strumenti");
    console.log(instruments);
    console.log(this.midiPlayer);
    const {tracks} = this.midiPlayer; 
    console.log(`Numero di tracce:${tracks.length}`);
    let envelopes = Array.from(Array(tracks.length), () => new Array(128));
    console.log(`Inizializzo l'envelopes:`);
    console.log(envelopes);
    this.setState({envelopes});

    await this.loadInstruments(instruments);
   // note envelopes for each note and each track
  
 }

 loadInstruments = async (instruments) =>
 {
   for (let i=0; i<instruments.length;i++)
   {
     console.log(`Carico ${instruments[i]}`);
     this.midiSounds.cacheInstrument(instruments[i]);
     await this.midiSounds.player.loader.waitLoad(() =>
     {
       console.log("Strumento caricato");
     });
   }
   this.setState({instruments});
   console.log(`Strumenti:${instruments}`);
 }

handleMidiEvents = (event) => {
  if (event.name =="Program Change")
  {
    const channel = event.channel;
    const instrument = event.value;
    this.setChannelInstrument(channel,instrument);
  }
  else
if (event.name=="Note on")
{

 if (event.velocity==0)
 {
   this.stopNote(event);
 }
 else 
 {
   this.startNote(event);
 }
}
else if (event.name=="Note Off")
{
  this.stopNote(event);
}

else if (event.name=="Program Change")
{
   console.log("Evento Program Change!");
   console.log(event); 
   this.setChannelInstrument(event.channel,event.value);
}


}

 startNote = (event) => {

  const instrument = this.getChannelInstrument(event.channel);
  console.log(`Note On: (Track:${event.track}) ${event.noteNumber} Velocity:${event.velocity}`);
        
  const envelop = this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
    , this.midiSounds.equalizer.input
    , window[this.midiSounds.player.loader.instrumentInfo(instrument).variable]
    , 0, event.noteNumber, 9999,event.velocity);
     
    this.setNoteEnvelop(event, envelop);

    // eseguo il dispach del NoteOn
    //console.log(`Redux NoteOn:  ${event.noteNumber} ${event.velocity}`);
   this.props.noteOn(event.noteNumber,event.velocity);
  }

  stopNote = (event) =>{
    const track = event.track;
    const noteNumber = event.noteNumber;

    const noteEnvelop = this.getNoteEnvelop(track, noteNumber);
    if (noteEnvelop!=null)
    {
      noteEnvelop.cancel();
      this.setNoteEnvelop(event, null);
     this.props.noteOff(event.noteNumber);
    }
    
  }

  setNoteEnvelop = (event,envelope) =>
    {
      const track = event.track;
      const noteNumber = event.noteNumber;
      const {envelopes} = this.state;
      let newEnvelopes = [...envelopes];
      newEnvelopes[track-1][noteNumber] = envelope;
      this.setState({"envelopes": newEnvelopes});  
    }

  getNoteEnvelop = (track, noteNumber) =>
    {
      return this.state.envelopes[track-1][noteNumber];
    } 

  setChannelInstrument = (channel, instrument) =>
  {
       const {channelInstrument} = this.state;
       let newChannnelInstrument = [...channelInstrument];
       newChannnelInstrument[channel-1]=instrument;
       this.setState({"channelInstrument": newChannnelInstrument});
  }

  getChannelInstrument = (channel) => {
      return this.state.channelInstrument[channel-1];
  }

  playMidi = () => {
        console.log("Playing...");
        this.midiPlayer.play();
    }

  stopMidi = () =>  {
        console.log("Stop...");
        this.midiPlayer.stop();
    }
 
  
  render() {

    const {instruments, envelopes} = this.state;
    const fileReady = instruments!=null && instruments.length>0 && envelopes!=null;
    //console.log(`instruments: ${instruments}`);

    return (
     
      <div className="App">
     
        <p><button disabled={!fileReady} onClick={this.playMidi.bind(this)}>Play</button></p>
        <p><button onClick={this.stopMidi.bind(this)}>Stop</button></p>
        <MIDISounds ref={(ref) => (this.midiSounds = ref)} 
        appElementName="root" 
        instruments={instruments} />	
      </div>
      
    );
  }
}

const mapDispatchToProps = {
 noteOn,
 noteOff
}
// devo solo eseguire dei dispatch, non mi serve leggero lo stato dallo store
export default connect(null, mapDispatchToProps)(App);