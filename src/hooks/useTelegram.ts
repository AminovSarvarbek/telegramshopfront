interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
  };
  colorScheme: string;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: any;
  BackButton: any;
  ready: () => void;
  expand: () => void;
  close: () => void;
}

// Access the Telegram WebApp instance
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const tg = window.Telegram?.WebApp;
  
  const user = tg?.initDataUnsafe?.user || null;
  const userId = user?.id;
  const firstName = user?.first_name;
  const lastName = user?.last_name;
  const username = user?.username;
  
  const isInTelegram = !!tg;
  
  // Format user data for API requests
  const getUserData = () => {
    if (!user) {
      // Return empty object or mock data if not in Telegram
      const isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        const mockData = {
          id: 12345678,
          first_name: 'Dev',
          username: 'dev_user',
          auth_date: Math.floor(Date.now() / 1000).toString()
        };
        localStorage.setItem('telegram_user', JSON.stringify(mockData));
        return mockData;
      }
      return null;
    }
    
    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      auth_date: tg.initDataUnsafe.auth_date,
      hash: tg.initDataUnsafe.hash
    };

    // Store user data in localStorage for API interceptor
    localStorage.setItem('telegram_user', JSON.stringify(userData));
    return userData;
  };
  
  return {
    tg,
    user,
    userId,
    firstName,
    lastName,
    username,
    isInTelegram,
    getUserData
  };
}