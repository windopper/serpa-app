import React, { useRef, useState } from 'react';
import {
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import ActionMenu from './ActionMenu';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onPressSearch: () => void;
  onSendImage?: (imageData: any) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onPressSearch, 
  onSendImage 
}) => {
  const [message, setMessage] = useState('');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const buttonColor = useThemeColor('primaryButtonBackground');

  const handleButtonPress = () => {
    if (message.trim() !== '') {
      // 메시지가 입력된 경우 메시지 보내기
      onSendMessage(message);
      setMessage('');
    } else {
      // 메시지가 없는 경우 통합 검색 모달 표시
      onPressSearch();
    }
  };

  const handleAddButtonPress = () => {
    // 액션 메뉴 토글 (애니메이션 없이 즉시 전환)
    setShowActionMenu(!showActionMenu);
    if (inputRef.current) {
      inputRef.current.blur(); // 키보드 숨기기
    }
  };

  const handleActionSelect = (action: string, result?: any) => {
    // 각 액션에 맞는 기능 구현
    console.log(`선택된 액션: ${action}`);
    setShowActionMenu(false);
    
    if ((action === 'gallery' || action === 'camera') && result) {
      // 이미지 전송 처리
      if (onSendImage) {
        onSendImage(result);
      } else {
        Alert.alert('알림', '이미지 전송 기능이 구현되지 않았습니다.');
      }
    } else if (action === 'map') {
      // 지도 기능 처리 (현재는 Alert으로 알림만 표시)
      Alert.alert('알림', '지도 기능은 추후 업데이트 될 예정입니다.');
    }
  };
  
  // 버튼 아이콘 결정 함수
  const getButtonIcon = () => {
    return message.trim() !== '' ? 'paper-plane' : 'search';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
      style={styles.inputContainer}
    >
      <View style={styles.inputWrapper}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress}
        >
          <Ionicons name="add" size={24} color={textColor} />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={[styles.input, { color: textColor, borderColor: tintColor }]}
          value={message}
          onChangeText={setMessage}
          onFocus={() => setShowActionMenu(false)}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#888"
          multiline
        />

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: buttonColor }]}
          onPress={handleButtonPress}
        >
          <Ionicons name={getButtonIcon()} size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 분리된 ActionMenu 컴포넌트 사용 */}
      {showActionMenu && (
        <ActionMenu onSelectAction={handleActionSelect} />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: Platform.OS === 'ios' ? 15 : 5,
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
});

export default ChatInput;