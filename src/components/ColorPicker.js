import React from 'react';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {

    constructor(props)
    {
      super(props);
      console.log(`COLOR:${props.color}`);
      const rgb = this.props.color.match(/\d+/g);

      this.state = {
        displayColorPicker: false,
        color: {
          r:  rgb[0],
          g: rgb[1],
          b: rgb[2],
          a: rgb[3] == null ? 255 : rgb[3]
        },
      };

    }
   
  
    handleClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
  
    handleClose = () => {
      this.setState({ displayColorPicker: false })
    };
  
    handleChange = (color) => {
      this.setState({ color: color.rgb })
      const newColor = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      console.log("Nuovo colore:", newColor);
      this.props.onColorChanged(newColor);
    };

    render() {
  
      const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.9)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            top:'50px',
            left:'150px',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });
  
      return (
        <div>
          <div style={ styles.swatch } onClick={ this.handleClick }>
            <div style={ styles.color } />
          </div>
          { this.state.displayColorPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ this.handleClose }/>
            <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
          </div> : null }
  
        </div>
      )
    }
  }


  export default ColorPicker;