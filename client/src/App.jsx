import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocialSecurityProvider } from './context/SocialSecurityContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import Admin from './pages/Admin';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <SocialSecurityProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
                          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reservar" element={<Appointment />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SocialSecurityProvider>
    </AuthProvider>
  );
}

export default App;
