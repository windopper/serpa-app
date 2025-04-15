import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ChatInput from '@/components/chat/ChatInput';
import SearchModal from '@/components/chat/SearchModal';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  images?: any[];
};

export default function ChatTabScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요. 무엇을 도와드릴까요?', isUser: false },
    { id: '2', text: '안녕하세요 안녕하세요 안녕하세요', isUser: true },
  ]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  
  const textColor = useThemeColor('text');
  const tintColor = useThemeColor('tint');
  const buttonColor = useThemeColor('primaryButtonBackground');
  const backgroundColor = useThemeColor('background');

  const sendMessage = (message: string) => {
    if (message.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const autoReply: Message = {
        isUser: false,
        id: Date.now().toString(),
        text: '자동 응답 메시지입니다.'
      };
      
      setMessages(prev => [...prev, autoReply]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendImage = (imageData: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: '',
      isUser: true,
      images: [imageData]
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const autoReply: Message = {
        isUser: false,
        id: Date.now().toString(),
        text: '이미지를 받았습니다. 이미지에 대한 설명이 필요하신가요?'
      };
      
      setMessages(prev => [...prev, autoReply]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
    
    return (
      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View 
            key={index} 
            style={[
              styles.imageContainer, 
              { 
                width: isSingleImage ? imageWidth : imageWidth - 5,
                height: isSingleImage ? imageWidth * 0.75 : (imageWidth - 5) * 0.75 
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>SERPA</ThemedText>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isUser
                ? [styles.userMessage, { backgroundColor: "#9370DB" }]
                : [styles.botMessage, { backgroundColor: "#e6e6e6" }],
            ]}
          >
            {msg.text && (
              <ThemedText
                style={[
                  styles.messageText,
                  msg.isUser ? styles.userMessageText : styles.botMessageText,
                ]}
              >
                {msg.text}
              </ThemedText>
            )}

            {msg.images && msg.images.length > 0 && renderImageGrid(msg.images)}
          </View>
        ))}
      </ScrollView>

      <ChatInput
        onPressSearch={openSearchModal}
        onSendMessage={sendMessage}
        onSendImage={handleSendImage}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
    paddingBottom: 50,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 15,
    maxWidth: '80%',
    marginVertical: 5,
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
  botMessageText: {
    color: 'black',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  imageContainer: {
    backgroundColor: '#e0e0e0',
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
  inputContainer: {
    flexDirection: 'column',
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: Platform.OS === 'ios' ? 15 : 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginTop: 5,
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
  },
});