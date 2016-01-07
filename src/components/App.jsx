import React from 'react';
import AudioRecorder from './AudioRecorder';

class App extends React.Component {
  constructor() {
    console.log('creating app');
    super();
  }

  render() {
    return (
      <div>
        <AudioRecorder />
      </div>
    );
  }
}

export default App;
