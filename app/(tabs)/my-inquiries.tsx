import { StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInquiries, selectInquiry, type InquiryStatus } from '@/store/slices/inquiriesSlice';
import { createSession, setActiveSession } from '@/store/slices/chatSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function MyInquiriesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux 상태에서 문의 데이터 가져오기
  const { items: inquiries, loading, error } = useAppSelector(state => state.inquiries);
  
  // 화면이 포커스될 때마다 문의 목록을 업데이트
//   useFocusEffect(
//     useCallback(() => {
//       dispatch(fetchInquiries());
//     }, [dispatch])
//   );
  
  // useThemeColor 훅을 사용하여 테마별 색상 가져오기
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const buttonPrimaryColor = useThemeColor({}, 'buttonPrimary');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const iconColor = useThemeColor({}, 'icon');

  // 상태에 따른 배경색과 텍스트색 반환 함수 - 다크모드 대응
  const getStatusStyles = (status: InquiryStatus) => {
    const isDarkMode = backgroundColor === '#151718';
    
    switch (status) {
      case 'Answered':
        return {
          backgroundColor: isDarkMode ? 'rgba(16, 133, 72, 0.2)' : '#e6f7ed',
          color: isDarkMode ? '#34d058' : '#108548'
        };
      case 'Waiting':
        return {
          backgroundColor: isDarkMode ? 'rgba(140, 109, 31, 0.2)' : '#fcf8e3',
          color: isDarkMode ? '#ffd760' : '#8c6d1f'
        };
      case 'In Progress':
        return {
          backgroundColor: isDarkMode ? 'rgba(16, 104, 191, 0.2)' : '#e3f0ff',
          color: isDarkMode ? '#4d8aff' : '#1068bf'
        };
      case 'Closed':
        return {
          backgroundColor: isDarkMode ? 'rgba(80, 80, 80, 0.3)' : '#f0f0f0',
          color: isDarkMode ? '#aaaaaa' : '#666666'
        };
      default:
        return {
          backgroundColor: isDarkMode ? 'rgba(80, 80, 80, 0.3)' : '#f0f0f0',
          color: isDarkMode ? '#aaaaaa' : '#666666'
        };
    }
  };

  // 홈으로 이동하는 함수
  const navigateToHome = () => {
    router.push('/');
  };

  // 채팅 세션으로 이동하는 함수
  const navigateToChat = (inquiryId: number) => {
    // Redux 액션 디스패치 - 문의 선택
    dispatch(selectInquiry(inquiryId));
    
    // 선택한 문의에 해당하는 문의 객체 찾기
    const selectedInquiry = inquiries.find(inquiry => inquiry.id === inquiryId);
    
    if (selectedInquiry) {
      // 채팅 세션이 이미 존재하는지 확인 (문의에 연결된 채팅 세션 ID 사용)
      const chatSessionId = selectedInquiry.chatSessionId || inquiryId;
      
      // 해당 채팅 세션 활성화
      dispatch(setActiveSession(chatSessionId));
    }
    
    // chat 화면으로 이동하면서 inquiry ID를 파라미터로 전달
    router.push({
      pathname: '/(tabs)/chat',
      params: { inquiryId: inquiryId }
    });
  };

  // 새 문의 시작 함수
  const startNewInquiry = () => {
    // 새 문의를 위해 채팅 화면으로 이동
    router.push('/(tabs)/chat');
  };

  return (
    <ThemedView style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={navigateToHome}
        >
          <Ionicons 
            name="arrow-back" 
            size={22} 
            color={textColor} 
          />
          <ThemedText style={styles.backButtonText}>Back to Home</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>My Inquiries</ThemedText>
      </View>

      {/* 로딩 상태 표시 */}
      {loading && (
        <View style={styles.messageContainer}>
          <ThemedText style={styles.messageText}>로딩 중...</ThemedText>
        </View>
      )}

      {/* 에러 메시지 표시 */}
      {error && (
        <View style={styles.messageContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {/* 문의 목록 */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {inquiries.length === 0 && !loading ? (
          <View style={styles.messageContainer}>
            <ThemedText style={styles.messageText}>문의 내역이 없습니다.</ThemedText>
          </View>
        ) : (
          inquiries.map((inquiry) => (
            <TouchableOpacity 
              key={inquiry.id}
              style={[
                styles.inquiryItem, 
                { 
                  backgroundColor: cardColor,
                  borderWidth: 1,
                  borderColor: borderColor 
                }
              ]}
              onPress={() => navigateToChat(inquiry.id)}
            >
              <View style={styles.inquiryContent}>
                <ThemedText style={styles.placeName}>{inquiry.place}</ThemedText>
                <View style={styles.detailsRow}>
                  <ThemedText style={[styles.categoryText, { color: secondaryTextColor }]}>
                    {inquiry.category}
                  </ThemedText>
                  <ThemedText style={[styles.dot, { color: secondaryTextColor }]}>
                    •
                  </ThemedText>
                  <ThemedText style={[styles.dateText, { color: secondaryTextColor }]}>
                    {inquiry.date}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusStyles(inquiry.status).backgroundColor }
                ]}>
                  <ThemedText style={[
                    styles.statusText, 
                    { color: getStatusStyles(inquiry.status).color }
                  ]}>
                    {inquiry.status}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={iconColor} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* 신규 문의 버튼 */}
      {/* <TouchableOpacity 
        style={[styles.newInquiryButton, { backgroundColor: buttonPrimaryColor }]}
        onPress={startNewInquiry}
      >
        <ThemedText style={styles.newInquiryButtonText}>Start New Inquiry</ThemedText>
      </TouchableOpacity> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' 
      ? (Constants.statusBarHeight || 0) + 16 
      : (StatusBar.currentHeight || 0) + 16,
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  inquiryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    // 그림자 스타일은 유지하되, 다크모드에서는 borderColor로 구분감 제공
  },
  inquiryContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
  },
  dot: {
    marginHorizontal: 6,
  },
  dateText: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  newInquiryButton: {
    paddingVertical: 14,
    margin: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  newInquiryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});