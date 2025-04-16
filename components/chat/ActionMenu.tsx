import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import * as ImagePicker from 'expo-image-picker';

interface ActionMenuProps {
  onSelectAction: (action: string, result?: any) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onSelectAction }) => {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'inputBackground');

  const handleGallerySelect = async () => {
    try {
      // 갤러리 접근 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('갤러리 접근 권한이 필요합니다.');
        return;
      }

      // 갤러리에서 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        onSelectAction('gallery', result.assets[0]);
      }
    } catch (error) {
      console.error('갤러리 접근 오류:', error);
      alert('이미지를 선택하는 중 오류가 발생했습니다.');
    }
  };

  const handleCameraSelect = async () => {
    try {
      // 카메라 접근 권한 요청
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('카메라 접근 권한이 필요합니다.');
        return;
      }

      // 카메라 실행
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        onSelectAction('camera', result.assets[0]);
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      alert('카메라를 사용하는 중 오류가 발생했습니다.');
    }
  };

  const handleMapSelect = () => {
    onSelectAction('map');
  };

  return (
    <View style={styles.actionMenuContainer}>
      <View style={styles.actionMenu}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGallerySelect}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor, borderColor },
            ]}
          >
            <Ionicons name="images-outline" size={24} color={textColor} />
          </View>
          <ThemedText style={styles.actionText}>앨범</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCameraSelect}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor, borderColor },
            ]}
          >
            <Ionicons name="camera-outline" size={24} color={textColor} />
          </View>
          <ThemedText style={styles.actionText}>카메라</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMapSelect}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor, borderColor },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={24}
              color={textColor}
            />
          </View>
          <ThemedText style={styles.actionText}>지도</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionMenuContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 5,
  },
  actionMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ActionMenu;