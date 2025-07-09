import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Homepage from './components/Pages/Homepage/Homepage.tsx'
import Navbar from './components/Navbar.tsx';
import Projects from './components/Pages/Projects/Projects.tsx';
import ProjectWriteUp from './components/Pages/Projects/Write-ups/ProjectWriteUp.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/projects/:name" element={<ProjectWriteUp/>}/>
        <Route path='*' element={<div className='w-full h-full p-10 bg-gray-300 text-black'>404 Not Found</div>} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
 