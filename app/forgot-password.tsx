import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import SerpaLogo from '@/assets/icons/serpa_logo.svg'; // SERPA 로고 이미지 경로

export default function ForgotPasswordScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  // 테마 색상 가져오기
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const secondaryText = useThemeColor({}, 'secondaryText');

  const handleSendCode = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('오류', '이름과 이메일을 입력해주세요.');
      return;
    }
    
    // 여기서 서버로 인증 코드 요청 로직 구현
    console.log('인증 코드 요청:', name, email);
    setIsCodeSent(true);
    Alert.alert('알림', '입력하신 이메일로 인증 코드가 발송되었습니다.');
  };

  const handleConfirm = () => {
    if (!isCodeSent) {
      handleSendCode();
      return;
    }
    
    if (!authCode.trim()) {
      Alert.alert('오류', '인증 코드를 입력해주세요.');
      return;
    }
    
    // 인증 코드 확인 후 비밀번호 재설정 페이지로 이동
    console.log('인증 코드 확인:', authCode);
    // 실제로는 서버에서 인증 코드 검증 로직이 필요합니다
    router.push('/reset-password');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SERPA 로고 */}
      <View style={styles.logoContainer}>
        {/* <ThemedText style={styles.logoText}>SERPA</ThemedText> */}
        <SerpaLogo width={120} height={40} color={textColor} />
      </View>
      
      {/* 이름 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>NAME</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder="Jiara Martins"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 이메일 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>EMAIL</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder="hello@reallygreatsite.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 인증 코드 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>AUTHENTICATION CODE</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder="Please check your email"
          value={authCode}
          onChangeText={setAuthCode}
          keyboardType="number-pad"
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