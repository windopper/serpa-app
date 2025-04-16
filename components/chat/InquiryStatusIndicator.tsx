import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InquiryStatus } from '@/store/slices/inquiriesSlice';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InquiryStatusIndicatorProps {
  status: InquiryStatus;
}

export default function InquiryStatusIndicator({ status }: InquiryStatusIndicatorProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  
  // 타이핑 표시 애니메이션을 위한 상태
  const [typingDots, setTypingDots] = useState('.');
  
  // 스피너 애니메이션 효과 (Waiting 상태용)
  useEffect(() => {
    if (status === 'Waiting') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
      
      // 타이핑 애니메이션 시작
      const typingInterval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '.';
        });
      }, 500);
      
      return () => {
        clearInterval(typingInterval);
      };
    } else {
      spinValue.setValue(0);
    }
  }, [status, spinValue]);

  // 스피너 회전 애니메이션 계산
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (status === 'In Progress') {
    // In Progress 상태는 별도 표시가 없음
    return null;
  }

  return (
    <View style={[styles.container, { borderColor }]}>
      {status === 'Answered' && (
        <>
          <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <Text style={[styles.statusText, { color: textColor }]}>
            문의가 해결되었습니다.
          </Text>
        </>
      )}

      {status === 'Waiting' && (
        <>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="time-outline" size={18} color={tintColor} />
          </Animated.View>
          <View style={styles.waitingTextContainer}>
            <Text style={[styles.statusText, { color: textColor }]}>
              응답 대기 중입니다
            </Text>
            <Text style={[styles.typingIndicator, { color: tintColor }]}>
              상대가 작성 중입니다{typingDots}
            </Text>
          </View>
        </>
      )}

      {status === 'Closed' && (
        <>
          <View style={[styles.iconContainer, { backgroundColor: '#607D8B' }]}>
            <Ionicons name="close" size={16} color="#fff" />
          </View>
          <Text style={[styles.statusText, { color: textColor }]}>
            문의가 종료되었습니다.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  waitingTextContainer: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  typingIndicator: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
});