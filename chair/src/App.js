import './App.css';
import Landing from './components/Landing';
import Main from './components/Main';
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
