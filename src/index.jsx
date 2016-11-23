import React, { Component } from 'react';
import extend               from 'extend';
import blacklist            from 'blacklist';

import CaptureDisplay       from './display';
import InputCaptureButton   from './button';

class CameraScreenshotComponent extends Component {

  constructor(props) {
    super(props);
    this.state = { cameraActive: false, image: null };
    this.onChange        = this.onChange.bind(this);
    this.activateDisplay = this.activateDisplay.bind(this);
  }

  onChange(image) {
    this.setState({ cameraActive: false, image });
  }

  activateDisplay() {
    this.setState({ cameraActive: true });
  }

  render() {
    const props = blacklist(this.props, 'onChange', 'onClick', 'image');
    const { image } = this.state;
    const { inputComponent: InputComponent } = this.props;
    return (
      <div style={ (styles || {}).wrapper || {} }>
        { cameraActive ? <CaptureDisplay onCapture={this.onChange} /> : <InputComponent {...props} image={image} onClick={this.activateDisplay} /> }
      </div>
    );
  }

}

CameraScreenshotComponent.defaultProps = {
  styles: {},
  inputComponent: InputCaptureButton,
  label: ''        
};

export default CameraScreenshotComponent;