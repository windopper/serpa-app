import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import SerpaLogo from '@/assets/icons/serpa_logo.svg'; // SERPA 로고 이미지 경로

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 테마 색상 가져오기
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const secondaryText = useThemeColor({}, 'secondaryText');

  const handleConfirm = () => {
    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    // 여기서 비밀번호 재설정 API 호출
    console.log('비밀번호 변경 요청:', newPassword);
    
    // 비밀번호 변경 성공 후 로그인 페이지로 이동
    Alert.alert(
      '성공',
      '비밀번호가 성공적으로 변경되었습니다.',
      [{ text: '확인', onPress: () => router.push('/login') }]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SERPA 로고 */}
      <View style={styles.logoContainer}>
        {/* <ThemedText style={styles.logoText}>SERPA</ThemedText> */}
        <SerpaLogo width={120} height={40} color={textColor} />
      </View>
      
      {/* 새 비밀번호 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>NEW PASSWORD</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder=""
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 새 비밀번호 확인 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>ONE MORE NEW PASSWORD</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder=""
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
      
      {/* 로그인 페이지로 돌아가기 */}
      <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
        <ThemedText style={styles.loginLinkText}>로그인 페이지로 돌아가기</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 5,
    opacity: 0.7,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8639E8',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 15,
  },
  loginLinkText: {
    fontSize: 14,
    opacity: 0.8,
  },
});