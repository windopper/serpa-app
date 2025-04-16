import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/userSlice';

export function ThemeToggle() {
  // Redux와 기존 ThemeContext를 모두 사용 (마이그레이션 과정)
  const { theme: contextTheme, setTheme: setContextTheme } = useThemeContext();
  const dispatch = useAppDispatch();
  const reduxTheme = useAppSelector(state => state.user.theme);
  
  // 컴포넌트에서는 일단 contextTheme을 사용 (실제 테마 적용은 ThemeContext가 담당)
  // 하지만 상태 변경은 Redux와 Context 모두에 적용
  const theme = contextTheme;
  
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'card');

  // 테마 변경 처리 함수
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    // Redux 상태 업데이트
    dispatch(setTheme(newTheme));
    // ThemeContext도 업데이트 (마이그레이션 과정에서 둘 다 유지)
    setContextTheme(newTheme);
  };

  return (
    <ThemedView style={styles.container} darkColor={backgroundColor} lightColor={backgroundColor}>
      <ThemedText style={styles.title}>테마 설정</ThemedText>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, theme === 'light' && { borderColor: tintColor }]}
          onPress={() => handleThemeChange('light')}
        >
          <Ionicons
            name="sunny"
            size={24}
            color={theme === 'light' ? tintColor : iconColor}
          />
          <ThemedText
            style={[styles.optionText, theme === 'light' && { color: tintColor }]}
          >
            라이트 모드
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, theme === 'dark' && { borderColor: tintColor }]}
          onPress={() => handleThemeChange('dark')}
        >
          <Ionicons
            name="moon"
            size={24}
            color={theme === 'dark' ? tintColor : iconColor}
          />
          <ThemedText
            style={[styles.optionText, theme === 'dark' && { color: tintColor }]}
          >
            다크 모드
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, theme === 'system' && { borderColor: tintColor }]}
          onPress={() => handleThemeChange('system')}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme === 'system' ? tintColor : iconColor}
          />
          <ThemedText
            style={[styles.optionText, theme === 'system' && { color: tintColor }]}
          >
            시스템 설정
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});