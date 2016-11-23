import React, { Component } from 'react';

class CaptureDisplay extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { onClick, label } = this.props;
    return (
      <button onClick={onClick}></button>
    );
  }

}

export default CaptureDisplay;