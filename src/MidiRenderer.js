import React, { Component } from 'react';
import {Input, Badge, Label} from 'reactstrap';
//import './App.css';
import './styles.css';
import MIDISounds from 'midi-sounds-react';
import MidiPlayer from "midi-player-js";
import axios from "axios";
import {actions as MidiActions} from "./store/slices/midiSlice";
import {actions as SongMapperActions} from "./store/slices/songMapperSlice";
import {connect} from 'react-redux';
import { IconContext } from "react-icons";
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import { BsFillGearFill} from "react-icons/bs";
import IconButton from '@material-ui/core/IconButton';
import ReactTooltip from "react-tooltip";
import moment from 'moment';
import {getMidiUrl} from './midi2shapesMapper';
import  SettingsModal from './components/AppSettings';

//https://github.com/reduxjs/rtk-convert-todos-example

//https://github.com/surikov/midi-sounds-react-examples/blob/master/examples/midi-sounds-example10/src/App.js

//http://grimmdude.com/MidiPlayerJS/docs/Player.html#getTotalEvents

// Midi and Redux
//https://elenatorro.com/jsday-2017-talk/
//https://react-redux.js.org/using-react-redux/connect-mapdispatch


const loadMidi = async (url) => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return data;
};

class MidiRenderer extends Component {

  constructor(props)
  {
    super(props);
    console.log("START");
    console.log(props);
    this.state = {fileReady: false,
                  songDuration: 49,
                  isPaused: true,
                  // instruments to be loaded
                  instruments:[], 
                  // instrument related to each Midi Channel
                  channelInstrument: Array.from({length: 16}, (_, i) => 0),
                  // note envelopes for each note and each track
                  envelopes: null, //Array.from(Array(20), () => new Array(128)) // 16 tracks with 128 different notes available
                  status: "Keyboard disconnected",
                  modalSettingsOpen : false
                };
  }

  
 async componentDidMount()
 {
   // Initialize player and register event handler
   this.midiPlayer = new MidiPlayer.Player(this.handleMidiEvents);
  await this.loadMidi();
  this.startListening();
 }

 loadMidi = async () =>
 {
     const fileUrl = getMidiUrl();
    // Load a MIDI file
    //console.log(Player);
    this.midiPlayer.loadArrayBuffer(await loadMidi(fileUrl));
    const {instruments} = this.midiPlayer;
    console.log("Lista strumenti");
    console.log(instruments);
    console.log(this.midiPlayer);
    const {tracks} = this.midiPlayer; 
    console.log(`Numero di tracce:${tracks.length}`);
    let envelopes = Array.from(Array(tracks.length), () => new Array(128));
    console.log(`Inizializzo l'envelopes:`);
    console.log(envelopes);
    const songDuration = moment.duration(Math.floor(this.midiPlayer.getSongTime()), "seconds");
    const numTracks = tracks.length;
    this.setState({envelopes, songDuration, numTracks, fileName: fileUrl});
    
    // redux dispatch 
    this.props.setMidiUrl({"midiUrl": fileUrl });

    await this.loadInstruments(instruments);
   // note envelopes for each note and each track
   this.props.onMidiLoaded({numTracks, instruments, fileName: fileUrl});
  
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

  //console.log(`Evento ${event.name} vel: ${event.velocity}`);

  
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
else if (event.name=="Note off")
{

  this.stopNote(event);
}
else
if (event.name =="Program Change")
  {
    const channel = event.channel;
    const instrument = event.value;
    this.setChannelInstrument(channel,instrument);
  }
}

 startNote = (event) => {

  const instrument = this.getChannelInstrument(event.channel);
  //console.log(`Note On: (Track:${event.track}) ${event.noteNumber} Velocity:${event.velocity}`);
        
  const envelop = this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
    , this.midiSounds.equalizer.input
    , window[this.midiSounds.player.loader.instrumentInfo(instrument).variable]
    , 0, event.noteNumber, 9999,event.velocity);
     
    this.setNoteEnvelop(event, envelop);

    // eseguo il dispach del NoteOn
  //console.log(`Redux NoteOn:`, event);
   
   this.props.noteOn(event);
  }

  stopNote = (event) =>{
    const track = event.track;
    const noteNumber = event.noteNumber;

    const noteEnvelop = this.getNoteEnvelop(track, noteNumber);
    if (noteEnvelop!=null)
    {
      noteEnvelop.cancel();
      this.setNoteEnvelop(event, null);
    //console.log(`Redux NoteOff:`, event);
     this.props.noteOff(event);
    }
    
  }

  setNoteEnvelop = (event,envelope) =>
    {
      const track = event.track;
      const noteNumber = event.noteNumber;
      const {envelopes} = this.state;
      let newEnvelopes = [...envelopes];
      newEnvelopes[track-1][noteNumber] = envelope;
      this.setState({"envelopes": newEnvelopes}, () => {
             this.props.onNoteEvent({"event" : event, "envelope" : newEnvelopes})
            }); 
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
        this.setState({isPaused: false});
    }

  pauseMidi = () => {
      console.log("Pausing...");
      this.midiPlayer.pause();
      this.setState({isPaused: true});
  }

  stopMidi = () =>  {
        console.log("Stop...");
        this.midiPlayer.stop();
        this.props.resetAll();
        this.setState({isPaused: true});
    }

    componentDidUpdate(prevProps,prevState)
    {
        if (this.state.isPaused!=prevState.isPaused)
        {
            ReactTooltip.rebuild();
        }
    }


    openSettings = () =>
    {
      console.log("Open settings");
      this.setState({"modalSettingsOpen" : true});
    }

    closeSettings = () =>
    {
      this.setState({"modalSettingsOpen" : false});
    }


    // MIDI KEYBOARD HANDLING

    midiOnMIDImessage = (event) => {
      console.log("EVENTO MIDI", event);
      var data = event.data;
      var cmd = data[0] >> 4;
      var channel = data[0] & 0xf;
      var type = data[0] & 0xf0;
      var pitch = data[1];
      var velocity = data[2];
      // eslint-disable-next-line default-case
      switch (type) {
      case 144:
        if (velocity>0) this.startNote({"track": 1, velocity, "noteNumber" : pitch,
                                    "channel" :1, "tick":0, "name": "Note on"});
        break;
      case 128:
        this.keyUp(pitch);
        break;
      }
  
      if (velocity==0) this.stopNote({"track": 1, velocity, "noteNumber" : pitch,
      "channel" :1, "tick":0, "name": "Note off"});
    }
    onMIDIOnStateChange = (event) => {
      this.setState({status:event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state});
    }
    requestMIDIAccessSuccess = (midi)=> {
      console.log("CONNESSIONE MIDI RIUSCITA!!!");
      console.log(midi);
      var inputs = midi.inputs.values();
      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = this.midiOnMIDImessage.bind(this);
      }
      midi.onstatechange = this.onMIDIOnStateChange.bind(this);
    }
    requestMIDIAccessFailure =(e) => {
      console.log("CONNESSIONE MIDI  FALLITA!!!");
      console.log('requestMIDIAccessFailure', e);
      this.setState({status:'MIDI Access Failure'});
    }

    startListening = () => {
      console.log("Inizio ad ascaoltare le connessioni midi");
      this.setState({status:'waiting'});
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess.bind(this), this.requestMIDIAccessFailure.bind(this));
      } else {
        this.setState({status:'navigator.requestMIDIAccess undefined'});
      }
    }

    // ----------------------------
 
  
  render() {

    const {instruments, envelopes, isPaused, songDuration, numTracks} = this.state;
    const fileReady = instruments!=null && instruments.length>0 && envelopes!=null;
    const formattedDuration = moment(songDuration).format("HH:MM:SS") //  moment.duration(songDuration, "seconds")
    
    //console.log(`instruments: ${instruments}`);
    
    return (
     
      <div className="App">
        <div style={{flex: 1, flexDirection: 'row' , justifyContent :'flex-start', alignItems:'flex-start', flexShrink: '0'}}>
         {
           isPaused ? (
          <IconButton  disabled={!fileReady} onClick={this.playMidi.bind(this)} >
                <IconContext.Provider value={{ color:  `white`, 
                                              className: "global-class-name" , size: "0.5em"}}>
                    <FaPlay data-place="top" data-tip={"Play midi"} />
                </IconContext.Provider>
            </IconButton>)
             :
                (
                <IconButton  disabled={!fileReady} onClick={this.pauseMidi.bind(this)} >
                  <IconContext.Provider value={{ color:  `white`, 
                                                className: "global-class-name" , size: "0.5em"}}>
                      <FaPause data-place="top" data-tip={"Pause midi"} />
                  </IconContext.Provider>
              </IconButton>

                )
            }
            <IconButton  disabled={!fileReady} onClick={this.stopMidi.bind(this)} >
                <IconContext.Provider value={{ color:  `white`, 
                                              className: "global-class-name" , size: "0.5em"}}>
                    <FaStop data-place="top" data-tip={"Stop midi"} />
                </IconContext.Provider>
            </IconButton>

            <IconButton  onClick={this.openSettings.bind(this)} >
                <IconContext.Provider value={{ color:  `white`, 
                                              className: "global-class-name" , size: "0.5em"}}>
                    <BsFillGearFill data-place="top" data-tip={"Open settings"} />
                </IconContext.Provider>
            </IconButton>

            { fileReady && 
                <div style={{display:'inline-block', margin:'10px'}}>
                <Badge style={{color: "white"}} pill>Numero tracce: {numTracks}  (Durata:{formattedDuration} secs.)</Badge>
                </div>
            }


            <SettingsModal isOpen={this.state.modalSettingsOpen} onCloseSettings={
              () => this.closeSettings()}/>
           
          
            <ReactTooltip/>  
        </div>
        
        
        <MIDISounds ref={(ref) => (this.midiSounds = ref)} 
        appElementName="root" 
        instruments={instruments} />	
      </div>
      
    );
  }
}

const mapDispatchToProps = {
 noteOn : MidiActions.noteOn,
 noteOff : MidiActions.noteOff,
 resetAll: MidiActions.resetAll,
 setMidiUrl : SongMapperActions.setMidiUrl
}
// devo solo eseguire dei dispatch, non mi serve leggere lo stato dallo store
export default connect(null, mapDispatchToProps)(MidiRenderer);