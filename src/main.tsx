import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Homepage from './components/Pages/Homepage/Homepage.tsx'
import Navbar from './components/Navbar.tsx';
import Projects from './components/Pages/Projects/Projects.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<Projects/>}/>
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
 