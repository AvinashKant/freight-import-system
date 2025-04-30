import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Dashboard from './features/dashboard/Pages';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
