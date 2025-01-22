import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/page/HomePage';
import ViewTemplate from './components/ViewTemplate';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route for the HomePage */}
          <Route path="/" element={<HomePage />} />
          {/* Route for the ViewTemplate */}
          <Route path="/view-template" element={<ViewTemplate />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
