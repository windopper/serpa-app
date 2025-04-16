import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import { Stack, router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import SerpaLogo from '@/assets/icons/serpa_logo.svg'; // SERPA 로고 이미지 경로

// 디바이스 너비 구하기
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  
  // 모달 상태 관리
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isNationalityPickerVisible, setNationalityPickerVisible] = useState(false);
  
  // 임시 저장 값 (모달에서 선택하다가 취소할 경우를 위함)
  const [tempDateOfBirth, setTempDateOfBirth] = useState('');
  const [tempNationality, setTempNationality] = useState('');

  // 테마 색상 가져오기
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const inputBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const modalBackground = useThemeColor({}, 'card');

  const handleSignup = () => {
    // 비밀번호 일치 확인
    if (password !== verifyPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // TODO: 회원가입 로직 구현
    console.log('회원가입 시도:', { name, email, password, dateOfBirth, nationality });
    
    // 회원가입 성공 후 로그인 페이지로 이동
    router.push('/login');
  };

  // 국가 목록 샘플
  const countries = [
    { label: '선택하세요', value: '' },
    { label: '대한민국', value: 'KR' },
    { label: '미국', value: 'US' },
    { label: '일본', value: 'JP' },
    { label: '중국', value: 'CN' },
    { label: '영국', value: 'GB' },
    { label: '캐나다', value: 'CA' },
    { label: '호주', value: 'AU' },
    { label: '프랑스', value: 'FR' },
    { label: '독일', value: 'DE' },
    { label: '기타', value: 'OTHER' },
  ];

  // 임시 생년월일 선택 - 실제 구현에서는 날짜 선택기를 사용해야 합니다
  const birthYears = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: `${year}년`, value: year.toString() };
  });

  // 생년월일 선택 확인
  const confirmDateOfBirth = () => {
    setDateOfBirth(tempDateOfBirth);
    setDatePickerVisible(false);
  };

  // 국적 선택 확인
  const confirmNationality = () => {
    setNationality(tempNationality);
    setNationalityPickerVisible(false);
  };

  // 모달 취소
  const cancelDatePicker = () => {
    setTempDateOfBirth(dateOfBirth); // 이전 선택값으로 복원
    setDatePickerVisible(false);
  };

  const cancelNationalityPicker = () => {
    setTempNationality(nationality); // 이전 선택값으로 복원
    setNationalityPickerVisible(false);
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
      
      {/* 비밀번호 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>PASSWORD</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder="******"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 비밀번호 확인 입력 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>VERIFY PASSWORD</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackground, borderColor, color: textColor }]}
          placeholder="******"
          value={verifyPassword}
          onChangeText={setVerifyPassword}
          secureTextEntry
          placeholderTextColor={secondaryText}
        />
      </View>
      
      {/* 생년월일 선택 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>DATE OF BIRTH</ThemedText>
        <TouchableOpacity 
          style={[styles.selectInput, { backgroundColor: inputBackground, borderColor }]}
          onPress={() => {
            setTempDateOfBirth(dateOfBirth);
            setDatePickerVisible(true);
          }}
        >
          <Text style={[
            styles.selectText, 
            !dateOfBirth && styles.placeholderText, 
            { color: dateOfBirth ? textColor : secondaryText }
          ]}>
            {dateOfBirth || '생년월일 선택'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 국적 선택 필드 */}
      <View style={styles.inputContainer}>
        <ThemedText style={styles.inputLabel}>NATIONALITY</ThemedText>
        <TouchableOpacity 
          style={[styles.selectInput, { backgroundColor: inputBackground, borderColor }]}
          onPress={() => {
            setTempNationality(nationality);
            setNationalityPickerVisible(true);
          }}
        >
          <Text style={[
            styles.selectText, 
            !nationality && styles.placeholderText, 
            { color: nationality ? textColor : secondaryText }
          ]}>
            {nationality ? countries.find(c => c.value === nationality)?.label : '국적 선택'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Confirm</Text>
      </TouchableOpacity>
      
      {/* 로그인 페이지로 돌아가기 */}
      <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
        <ThemedText style={styles.loginLinkText}>이미 계정이 있으신가요? 로그인하기</ThemedText>
      </TouchableOpacity>

      {/* 생년월일 선택 모달 */}
      <Modal 
        isVisible={isDatePickerVisible}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        avoidKeyboard={true}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        propagateSwipe={false}
        onBackdropPress={() => {}} // 배경 터치로 닫히지 않도록 빈 함수 설정
      >
        <View style={[styles.modalContent, { backgroundColor: modalBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={cancelDatePicker}>
              <Text style={[styles.modalCancel, { color: secondaryText }]}>취소</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>생년월일 선택</Text>
            <TouchableOpacity onPress={confirmDateOfBirth}>
              <Text style={styles.modalConfirm}>확인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tempDateOfBirth}
              onValueChange={setTempDateOfBirth}
              style={styles.picker}
              itemStyle={{ color: textColor }}
            >
              <Picker.Item label="생년월일 선택" value="" color={secondaryText} />
              {birthYears.map((year) => (
                <Picker.Item 
                  key={year.value} 
                  label={year.label} 
                  value={year.value} 
                  color={textColor}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: borderColor }]} />
          </View>
        </View>
      </Modal>

      {/* 국적 선택 모달 */}
      <Modal 
        isVisible={isNationalityPickerVisible}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        avoidKeyboard={true}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        propagateSwipe={false}
        onBackdropPress={() => {}} // 배경 터치로 닫히지 않도록 빈 함수 설정
      >
        <View style={[styles.modalContent, { backgroundColor: modalBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={cancelNationalityPicker}>
              <Text style={[styles.modalCancel, { color: secondaryText }]}>취소</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>국적 선택</Text>
            <TouchableOpacity onPress={confirmNationality}>
              <Text style={styles.modalConfirm}>확인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tempNationality}
              onValueChange={setTempNationality}
              style={styles.picker}
              itemStyle={{ color: textColor }}
            >
              {countries.map((country) => (
                <Picker.Item 
                  key={country.value} 
                  label={country.label} 
                  value={country.value} 
                  color={textColor}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: borderColor }]} />
          </View>
        </View>
      </Modal>
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
    marginBottom: 30,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 8,
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
  selectInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 14,
  },
  placeholderText: {
    opacity: 0.5,
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#8639E8',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  signupButtonText: {
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
  // 모달 스타일
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    overflow: 'hidden', // 내부 컨텐츠가 바깥으로 넘치지 않도록 설정
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancel: {
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  modalConfirm: {
    fontSize: 15,
    color: '#8639E8',
    fontWeight: '600',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  pickerContainer: {
    width: SCREEN_WIDTH,
    height: 200, // 고정 높이 설정
  },
  picker: {
    width: '100%',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});