import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import RiskResultPage from './pages/RiskResultPage';
import ChatbotPage from './pages/ChatbotPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuccessPage from './components/dashboard/SuccessPage';
import { Toaster } from 'sonner';

export function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/risk-result" element={<RiskResultPage />} />
                        <Route path="/chatbot" element={<ChatbotPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard/*" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/*" element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminPanel />
                            </ProtectedRoute>
                        } />
                        {/* Move the success route inside the Routes component */}
                        <Route path="/success" element={<SuccessPage />} />
                    </Routes>
                </main>
                <Footer />
                <Toaster position="top-right" />
            </div>
        </Router>
    );
}