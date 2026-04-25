import React from 'react';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

import Preloader from './components/Preloader';

function App() {
  return (
    <div className="App">
      <Preloader>
        <Dashboard />
      </Preloader>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'glass text-white border border-border rounded-xl',
          duration: 4000,
          style: {
            background: '#0f0f0f',
            color: '#fff',
            border: '1px solid #2a2a2a',
          },
        }}
      />
    </div>
  );
}

export default App;
