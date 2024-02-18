import './App.css';
import Landing from './components/Landing';
import UglyMain from './components/UglyMain';
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="ugly-main" element={<UglyMain/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
