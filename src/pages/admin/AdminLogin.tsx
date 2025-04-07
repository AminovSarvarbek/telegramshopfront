// src/pages/admin/AdminLogin.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { verifyAdmin } from '../../services/api';
import CustomAlert from '../../components/CustomAlert';

const AdminLogin: React.FC = () => {
  const { getUserData, isInTelegram } = useTelegram();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState<'success' | 'error'>('error');
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Wait for Telegram WebApp to be ready
    const checkTelegramWebApp = () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        setIsLoading(false);
      } else {
        // If not available yet, check again in 100ms
        setTimeout(checkTelegramWebApp, 100);
      }
    };
    
    checkTelegramWebApp();
  }, []);

  const handleLogin = async () => {
    try {
      // Get Telegram user data
      const userData = getUserData();
      
      if (!userData) {
        setAlertType('error');
        setAlertMessage('Telegram foydalanuvchi ma\'lumotlarini olishda xatolik');
        setAlertOpen(true);
        return;
      }

      const result = await verifyAdmin(userData);
      
      if (result.success && result.isAdmin) {
        sessionStorage.setItem('adminData', JSON.stringify(userData));
        navigate('/admin/dashboard');
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Sizda admin huquqlari yo\'q');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Server bilan bog\'lanishda xatolik yuz berdi');
      setAlertOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInTelegram) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Xatolik!</h2>
            <p className="text-gray-600">
              Bu sahifaga kirish uchun Telegram WebApp orqali kirish kerak
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h-1" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h2>
          <p className="text-gray-600 mb-8">
            Admin panelga kirish uchun Telegram orqali tasdiqlang
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Kirish
          </button>
        </div>
      </div>

      <CustomAlert 
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
};

export default AdminLogin;