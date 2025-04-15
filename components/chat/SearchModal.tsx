import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchModalProps {
  visible: boolean;
  searchQuery: string;
  onChangeSearchQuery: (text: string) => void;
  onClose: () => void;
  onSearch: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  searchQuery,
  onChangeSearchQuery,
  onClose,
  onSearch,
}) => {
  const textColor = useThemeColor('text');
  const backgroundColor = useThemeColor('background');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>통합 검색</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              value={searchQuery}
              onChangeText={onChangeSearchQuery}
              placeholder="영문/한글 검색"
              placeholderTextColor="#888"
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
          </View>

          <View style={styles.searchTabs}>
            <TouchableOpacity style={styles.searchTab}>
              <ThemedText>통합검색</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchTab}>
              <ThemedText>이미지</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchTab}>
              <ThemedText>동영상</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchTab}>
              <ThemedText>지도</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.searchResultsContainer}>
            <ThemedText style={styles.noResultsText}>
              {searchQuery.trim() === ""
                ? "검색어를 입력하세요"
                : "검색 결과가 없습니다"}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default SearchModal;