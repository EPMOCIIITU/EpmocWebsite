import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import GridBackground from './components/GridBackground';
import Navbar from './components/Navbar';

import PageTransition from './components/PageTransition';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ArchivePage from './pages/ArchivePage';
import GalleryPage from './pages/GalleryPage';
import EventDetailPage from './pages/EventDetailPage';
import CommandCenter from './components/CommandCenter';
import TaskManagementPage from './pages/TaskManagementPage';
import EventCreatePage from './pages/EventCreatePage';
import EventManagePage from './pages/EventManagePage';
import RoleManagementPage from './pages/RoleManagementPage';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastPlayed = localStorage.getItem('loader_last_played');
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;

    if (!lastPlayed || (now - parseInt(lastPlayed, 10) > twelveHours)) {
      setLoading(true);
      localStorage.setItem('loader_last_played', now.toString());
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <div className="noise fixed inset-0"></div>
      <Cursor />
      <GridBackground />

      <Navbar />

      <div id="main-content" style={{ opacity: loading ? 0 : 1, transition: 'opacity 1.5s ease' }}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/command" element={<CommandCenter />} />
            <Route path="/command/tasks" element={<TaskManagementPage />} />
            <Route path="/command/roles" element={<RoleManagementPage />} />
            <Route path="/command/events/new" element={<EventCreatePage />} />
            <Route path="/command/events/:id/manage" element={<EventManagePage />} />
          </Routes>
        </PageTransition>
      </div>
    </>
  )
}

export default App;
