/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0061FF';
const tintColorDark = '#4D8AFF';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#F2F2F2',
    border: 'rgb(187, 187, 187)',
    notification: '#FF3B30',
    buttonPrimary: '#0061FF',
    buttonSecondary: '#E5E5E5',
    placeholderText: '#9BA1A6',
    inputBackground: '#F9F9F9',
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    secondaryText: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#252729',  // 더 밝게 조정하여 배경과의 구분을 명확하게
    border: 'rgba(120, 120, 120, 0.5)',  // 더 밝은 테두리 색상으로 변경
    notification: '#FF453A',
    buttonPrimary: '#4D8AFF',
    buttonSecondary: '#2C2D2E',
    placeholderText: '#9BA1A6',  // 더 밝게 조정
    inputBackground: '#1E1F20',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    secondaryText: '#AAAAAA',  // 추가: 보조 텍스트 색상
  },
};
