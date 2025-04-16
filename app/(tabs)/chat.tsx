import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ChatInput from '@/components/chat/ChatInput';
import SearchModal from '@/components/chat/SearchModal';
import InquiryStatusIndicator from '@/components/chat/InquiryStatusIndicator';
import { Colors } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, createSession, setActiveSession, closeSession } from '@/store/slices/chatSlice';
import { addInquiry } from '@/store/slices/inquiriesSlice';
import { store } from '@/store';

// 대화 시나리오 상태를 추적하기 위한 타입
type ConversationState = 'initial' | 'asking_place' | 'asking_category' | 'confirming' | 'complete';

type MessageDisplay = {
  id: string;
  text: string;
  isUser: boolean;
  images?: any[];
  timestamp?: string;
};

export default function ChatTabScreen() {
  const { inquiryId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux 상태에서 채팅 데이터 가져오기
  const { sessions, activeSessionId, loading } = useAppSelector(state => state.chat);
  const selectedInquiry = useAppSelector(state => 
    state.inquiries.items.find(item => item.id === Number(inquiryId))
  );
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 대화 시나리오 상태 관리
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [inquiryPlace, setInquiryPlace] = useState<string>('');
  const [inquiryCategory, setInquiryCategory] = useState<string>('');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const isDarkMode = useThemeColor({}, 'background') === Colors.dark.background;

  // 현재 세션의 메시지 가져오기
  const currentSession = activeSessionId !== null ? sessions[activeSessionId] : null;
  const sessionMessages = currentSession?.messages || [];
  
  // Redux 메시지를 UI 표시용 메시지로 변환
  const displayMessages: MessageDisplay[] = sessionMessages.map(msg => ({
    id: msg.id,
    text: msg.text,
    isUser: msg.sender === 'user',
    timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }) : undefined
  }));

  // inquiryId가 있으면 해당 문의에 대한 채팅 세션 활성화
  useEffect(() => {
    if (inquiryId) {
      const inquiryIdNum = Number(inquiryId);
      
      // 이미 세션이 있는지 확인
      if (sessions[inquiryIdNum]) {
        // 이미 있는 세션 활성화
        dispatch(setActiveSession(inquiryIdNum));
      } else {
        // 새 세션 생성
        dispatch(createSession({ 
          sessionId: inquiryIdNum,
          businessName: selectedInquiry?.place
        }));
        
        // 기본 메시지 추가
        setTimeout(() => {
          dispatch(addMessage({
            sessionId: inquiryIdNum,
            message: {
              text: `안녕하세요! 문의 #${inquiryId}에 대한 대화입니다. 무엇을 도와드릴까요?`,
              sender: 'system',
              timestamp: Date.now()
            }
          }));
        }, 500);
      }
      
      // 스크롤을 맨 아래로 이동
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } else {
      // 새 채팅 시작 - 기존에 활성화된 세션이 없으면 새 세션 생성
      if (activeSessionId === null) {
        const newSessionId = Date.now();
        dispatch(createSession({ sessionId: newSessionId }));
        setConversationState('initial');
        
        // 첫 환영 메시지와 장소를 물어보는 메시지 추가
        setTimeout(() => {
          dispatch(addMessage({
            sessionId: newSessionId,
            message: {
              text: "안녕하세요! 저는 SERPA의 문의 에이전트입니다. 한국 로컬 비즈니스와의 소통을 도와드릴게요.",
              sender: 'system',
              timestamp: Date.now()
            }
          }));
          
          // 잠시 후 장소에 대해 물어보기
          setTimeout(() => {
            dispatch(addMessage({
              sessionId: newSessionId,
              message: {
                text: "어떤 장소(식당, 카페, 미용실 등)에 대해 문의하고 싶으신가요?",
                sender: 'system',
                timestamp: Date.now()
              }
            }));
            setConversationState('asking_place');
          }, 1000);
        }, 500);
      }
    }
  }, [inquiryId, dispatch, sessions]);

  // 메시지 목록이 변경될 때마다 스크롤 내리기
  useEffect(() => {
    if (displayMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayMessages.length]);

  const sendMessage = (message: string) => {
    if (message.trim() === '' || activeSessionId === null) return;
    
    // Redux 액션으로 사용자 메시지 추가
    dispatch(addMessage({
      sessionId: activeSessionId,
      message: {
        text: message,
        sender: 'user',
        timestamp: Date.now()
      }
    }));
    
    // 대화 상태에 따라 다른 응답 처리
    if (conversationState === 'asking_place') {
      // 사용자가 장소를 입력했을 때
      setInquiryPlace(message.trim());
      
      // 카테고리 물어보기
      setTimeout(() => {
        dispatch(addMessage({
          sessionId: activeSessionId,
          message: {
            text: "문의 유형을 선택해주세요:\n1. 예약\n2. 영업시간\n3. 대기 리스트\n4. 기타",
            sender: 'system',
            timestamp: Date.now()
          }
        }));
        setConversationState('asking_category');
      }, 1000);
    } 
    else if (conversationState === 'asking_category') {
      // 사용자가 카테고리를 입력했을 때
      let category = "";
      
      // 카테고리 번호나 텍스트에 따라 처리
      const userInput = message.trim().toLowerCase();
      if (userInput === '1' || userInput.includes('예약')) {
        category = "Reservation";
      } else if (userInput === '2' || userInput.includes('영업') || userInput.includes('시간')) {
        category = "Business Hours";
      } else if (userInput === '3' || userInput.includes('대기')) {
        category = "Waiting List";
      } else {
        category = "Other";
      }
      
      setInquiryCategory(category);
      
      // 확인 메시지 보내기
      setTimeout(() => {
        dispatch(addMessage({
          sessionId: activeSessionId,
          message: {
            text: `'${inquiryPlace}'에 대한 '${category}' 문의를 생성할까요? (예/아니오)`,
            sender: 'system',
            timestamp: Date.now()
          }
        }));
        setConversationState('confirming');
      }, 1000);
    }
    else if (conversationState === 'confirming') {
      // 사용자가 확인에 응답했을 때
      const userInput = message.trim().toLowerCase();
      
      if (userInput === '예' || userInput === 'yes' || userInput === 'y' || userInput === '네') {
        // 문의 생성
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일`;
        
        // 새 문의 ID 생성 (Redux 상태에서 다음 ID 값을 계산)
        const inquiries = [...store.getState().inquiries.items];
        const newInquiryId = inquiries.length > 0 
          ? Math.max(...inquiries.map(item => item.id)) + 1
          : 1;
        
        // 새 문의 추가
        dispatch(addInquiry({
          id: newInquiryId, // 명시적으로 ID 지정
          place: inquiryPlace,
          category: inquiryCategory,
          status: 'Waiting',
          date: formattedDate,
          // 채팅 세션 ID를 문의에 저장 (현재 활성 세션 ID 사용)
          chatSessionId: activeSessionId
        }));
        
        // 기존 임시 채팅 세션의 ID를 문의 ID로 업데이트
        if (activeSessionId !== null && activeSessionId !== newInquiryId) {
          // 새 세션을 생성하여 이전 세션의 내용을 복사
          dispatch(createSession({ 
            sessionId: newInquiryId,
            businessName: inquiryPlace
          }));
          
          // 이전 세션의 메시지들을 새 세션으로 복사
          const oldSessionMessages = sessions[activeSessionId]?.messages || [];
          oldSessionMessages.forEach(msg => {
            dispatch(addMessage({
              sessionId: newInquiryId,
              message: {
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp
              }
            }));
          });
          
          // 이전 임시 세션 닫기
          dispatch(closeSession(activeSessionId));
          
          // 새 세션으로 활성 세션 변경
          dispatch(setActiveSession(newInquiryId));
        }
        
        // 완료 메시지 보내기
        setTimeout(() => {
          dispatch(addMessage({
            sessionId: newInquiryId, // 새 세션 ID 사용
            message: {
              text: `문의가 성공적으로 생성되었습니다. 담당자가 곧 응답드릴 예정입니다. 추가 문의사항이 있으시면 알려주세요.`,
              sender: 'system',
              timestamp: Date.now()
            }
          }));
          setConversationState('complete');
        }, 1000);
      } else {
        // 취소 메시지
        setTimeout(() => {
          dispatch(addMessage({
            sessionId: activeSessionId,
            message: {
              text: `문의 생성이 취소되었습니다. 새로운 문의를 하시려면 다시 장소를 알려주세요.`,
              sender: 'system',
              timestamp: Date.now()
            }
          }));
          
          // 다시 장소 물어보기
          setTimeout(() => {
            dispatch(addMessage({
              sessionId: activeSessionId,
              message: {
                text: "어떤 장소(식당, 카페, 미용실 등)에 대해 문의하고 싶으신가요?",
                sender: 'system',
                timestamp: Date.now()
              }
            }));
            setConversationState('asking_place');
          }, 1000);
        }, 1000);
      }
    }
    else if (conversationState === 'complete') {
      // 추가 질문에 대한 기본 응답
      setTimeout(() => {
        dispatch(addMessage({
          sessionId: activeSessionId,
          message: {
            text: '새로운 문의를 원하시면 "새 문의"라고 입력해주세요. 현재 문의에 대해서는 담당자가 확인 후 응답드릴 예정입니다.',
            sender: 'system',
            timestamp: Date.now()
          }
        }));
        
        // "새 문의" 입력 감지
        if (message.trim().includes('새 문의')) {
          setTimeout(() => {
            dispatch(addMessage({
              sessionId: activeSessionId,
              message: {
                text: "어떤 장소(식당, 카페, 미용실 등)에 대해 문의하고 싶으신가요?",
                sender: 'system',
                timestamp: Date.now()
              }
            }));
            setConversationState('asking_place');
          }, 1000);
        }
      }, 1000);
    }
  };

  const handleSendImage = (imageData: any) => {
    if (activeSessionId === null) return;
    
    // 이미지 메시지 추가 (실제 구현에서는 이미지 업로드 기능 필요)
    dispatch(addMessage({
      sessionId: activeSessionId,
      message: {
        text: '이미지가 전송되었습니다.',
        sender: 'user',
        timestamp: Date.now()
      }
    }));
    
    // 자동 응답
    setTimeout(() => {
      dispatch(addMessage({
        sessionId: activeSessionId,
        message: {
          text: '이미지를 받았습니다. 이미지에 대한 설명이 필요하신가요?',
          sender: 'business',
          timestamp: Date.now()
        }
      }));
    }, 1000);
  };

  const openSearchModal = () => {
    setShowSearchModal(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    
    console.log('검색어:', searchQuery);
    
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const renderImageGrid = (images: any[]) => {
    const isSingleImage = images.length === 1;
    const imageWidth = isSingleImage ? screenWidth * 0.7 : (screenWidth * 0.7) / 2;
    
    // 테마 기반 색상 정의
    const imageContainerBgColor = useThemeColor({}, 'card');
    
    return (
      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View 
            key={index} 
            style={[
              styles.imageContainer, 
              { 
                width: isSingleImage ? imageWidth : imageWidth - 5,
                height: isSingleImage ? imageWidth * 0.75 : (imageWidth - 5) * 0.75,
                backgroundColor: imageContainerBgColor,
                borderWidth: isDarkMode ? 1 : 0,
                borderColor: isDarkMode ? borderColor : 'transparent'
              }
            ]}
          >
            {image.uri ? (
              <Image
                source={{ uri: image.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <ThemedText style={styles.imageText}>이미지</ThemedText>
            )}
          </View>
        ))}
      </View>
    );
  };

  const handleBackButton = () => {
    if (inquiryId) {
      // 문의 목록 페이지로 돌아가기
      router.push('/(tabs)/my-inquiries');
    } else {
      // 홈 화면으로 돌아가기
      router.push('/');
    }
  };

  // 채팅 화면 상단 타이틀
  const headerTitle = selectedInquiry?.place || 'Chat with Local Agent';
  const headerSubtitle = inquiryId ? `Inquiry #${inquiryId}` : 'New Chat';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>
            {headerTitle}
          </ThemedText>
          <ThemedText style={{ 
            fontSize: 12, 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : useThemeColor({}, 'placeholderText') 
          }}>
            {headerSubtitle}
          </ThemedText>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>로딩 중...</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesList}
          >
            {displayMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
                ]}
              >
                {!msg.isUser && (
                  <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: useThemeColor({}, 'border') }]} />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    msg.isUser
                      ? [
                          styles.userMessage, 
                          { 
                            backgroundColor: useThemeColor({}, 'buttonPrimary'),
                            borderWidth: isDarkMode ? 1 : 0,
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'transparent' 
                          }
                        ]
                      : [
                          styles.botMessage, 
                          { 
                            backgroundColor: useThemeColor({}, 'card'),
                            borderWidth: isDarkMode ? 1 : 0,
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent' 
                          }
                        ],
                  ]}
                >
                  {msg.text && (
                    <ThemedText
                      style={[
                        styles.messageText,
                        msg.isUser && styles.userMessageText
                      ]}
                    >
                      {msg.text}
                    </ThemedText>
                  )}

                  {msg.images &&
                    msg.images.length > 0 &&
                    renderImageGrid(msg.images)}
                  {msg.timestamp && !msg.isUser && (
                    <ThemedText style={[
                      styles.timestamp, 
                      { 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : useThemeColor({}, 'placeholderText') 
                      }
                    ]}>
                      {msg.timestamp}
                    </ThemedText>
                  )}
                </View>
              </View>
            ))}
            
            {/* 문의 상태 표시기 (채팅 끝에 표시) */}
            {selectedInquiry && (
              <View style={styles.statusIndicatorContainer}>
                <InquiryStatusIndicator status={selectedInquiry.status} />
              </View>
            )}
          </ScrollView>
        </>
      )}

      <ChatInput
        onPressSearch={openSearchModal}
        onSendMessage={sendMessage}
        onSendImage={handleSendImage}
        disabled={selectedInquiry?.status === 'Closed'} // 종료된 문의는 비활성화
      />

      <SearchModal
        visible={showSearchModal}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
    paddingBottom: 50,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  imageContainer: {
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageText: {
    color: '#888',
  },
  statusIndicatorContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  fixedStatusContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
});