import './App.css';
import WebSocketConsole from './WebSocketConsole';
import React from 'react';
import useStore from './useStore';
import WifiForm from './WifiSetupForm';

function App() {
  const { currentForm, setCurrentForm } = useStore();

  const handleGoBack = () => {
    setCurrentForm(null);
  };

  return (
    <div className="App">
      <div style={{ display: currentForm === 'wifi' ? 'none' : 'block', height: '100%' }}>
        <WebSocketConsole />
      </div>
      <div style={{ display: currentForm === 'wifi' ? 'block' : 'none', height: '100%' }}>
        <WifiForm onGoBack={handleGoBack} />
      </div>
    </div>
  );
}

export default App;
