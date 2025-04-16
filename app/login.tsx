import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor'
import SerpaLogo from '@/assets/icons/serpa_logo.svg'; // SERPA 로고 이미지 경로

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // 테마 색상 가져오기
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryText = useThemeColor({}, 'secondaryText');

  const handleLogin = () => {
    // 실제 구현에서는 여기에 인증 로직을 추가해야 합니다
    console.log('로그인 시도:', email, password);
    
    // 로그인 성공 후 문의대행 페이지로 이동
    router.replace('/(tabs)/chat');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SERPA 로고 */}
      <View style={styles.logoContainer}>
        {/* <ThemedText style={styles.logoText}>SERPA</ThemedText> */}
        <SerpaLogo width={120} height={40} color={textColor} />
      </View>
      
      {/* 소셜 로그인 버튼 */}
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: inputBackground, borderColor }]}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
          style={styles.socialIcon} 
        />
        <Text style={[styles.socialButtonText, { color: textColor }]}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.socialButton, { backgroundColor: inputBackground, borderColor }]}>
        <Text style={[styles.socialIcon, styles.naverIcon]}>N</Text>
        <Text style={[styles.socialButtonText, { color: textColor }]}>Continue with Naver</Text>
      </TouchableOpacity>
      
      {/* 이메일 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>EMAIL</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 비밀번호 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>PASSWORD</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      
      {/* 비밀번호 찾기 & 회원가입 */}
      <View style={styles.bottomContainer}>
        <Link href="/forgot-password" asChild>
          <TouchableOpacity>
            <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
          </TouchableOpacity>
        </Link>
        
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <ThemedText style={[styles.signupText, { color: tintColor }]}>Signup !</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
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
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 1,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  naverIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#19CE60',
    color: 'white',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    borderRadius: 2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
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
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8639E8',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.8,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
  },
});