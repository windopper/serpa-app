import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        <Text style={styles.logoText}>SERPA</Text>
      </View>
      
      {/* 소셜 로그인 버튼 */}
      <TouchableOpacity style={styles.socialButton}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
          style={styles.socialIcon} 
        />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialButton}>
        <Text style={[styles.socialIcon, styles.naverIcon]}>N</Text>
        <Text style={styles.socialButtonText}>Continue with Naver</Text>
      </TouchableOpacity>
      
      {/* 이메일 입력 필드 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      {/* 비밀번호 입력 필드 */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.signupText}>Signup !</Text>
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    color: '#666',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
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
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  signupText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});