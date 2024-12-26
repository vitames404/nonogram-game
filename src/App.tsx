import React from 'react';
import Grid from './components/grid';
import Buttons from './components/buttons';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <Grid />
      <div className="mt-4">
        <Buttons />
      </div>
    </div>
  );
};

export default App;
