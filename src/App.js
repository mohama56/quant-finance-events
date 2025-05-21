import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpForm';
import TeamPage from './components/TeamPage';
import AdminPage from './components/AdminPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignUpForm />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;