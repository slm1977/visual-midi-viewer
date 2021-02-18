import React from 'react';
import { Input, Table } from 'reactstrap';
import {availablePrimitivesDict } from '../midi2shapesMapper';

const MidiTracksTable = (props) =>
{

    const renderShapeOptions = () =>
    {
      const options=[]
        
      Object.keys(availablePrimitivesDict).map((shapeName,index) =>
      {
      options.push(<option value={shapeName}>{shapeName}</option>) 
      })
      return options;
    }

    const tracks = []

    for (let i=0; i<props.numTracks;i++)
    {
        tracks.push(<tr>
            <td>Track {i+1}</td>
            <td><input type="checkbox"/></td>
            <Input id="trackShapeSelector" 
                    value={`TrackShapeSelector`}
                    type="select">
                   {renderShapeOptions()}
              </Input> 
        </tr>)
    }

        
    return (<Table>
        <thead>
        <tr>
          <th>Track Name</th>
          <th>Muted</th>
          <th>Shape</th>
        </tr>
        {tracks}
      </thead>
    </Table>)
}

export default MidiTracksTable;