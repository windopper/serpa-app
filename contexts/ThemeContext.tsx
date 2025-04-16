import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  activeTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@serpa_app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 시스템 테마 값을 가져옵니다.
  const deviceTheme = useDeviceColorScheme() ?? 'light';
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);

  // 테마 설정을 로컬 스토리지에서 불러옵니다.
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('테마 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTheme();
  }, []);

  // 테마를 변경하고 저장하는 함수
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('테마 저장 실패:', error);
    }
  };

  // 실제 사용할 테마 결정 (system인 경우 디바이스 테마 사용)
  const activeTheme = theme === 'system' ? deviceTheme : theme;

  // 항상 ThemeContext.Provider로 감싸서 반환합니다 (로딩 중일 때도)
  return (
    <ThemeContext.Provider
      value={{
        theme,
        systemTheme: deviceTheme,
        activeTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// 테마 컨텍스트를 사용하기 위한 커스텀 훅
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext는 ThemeProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}