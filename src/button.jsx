import React, { Component } from 'react';

class InputCaptureButton extends Comment {
  
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick } = this.props;
    return (
      <button onClick={onClick}></button>
    );
  }

}


export default InputCaptureButton;