import { StyleSheet, ScrollView, TouchableOpacity, View, Platform, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Collapsible } from '@/components/Collapsible';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Colors } from '@/constants/Colors';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function FaqScreen() {
  const { activeTheme } = useThemeContext();
  const router = useRouter();
  const cardBackgroundColor = useThemeColor({}, 'card');
  const supportButtonBgColor = useThemeColor({}, 'buttonPrimary');

  // 홈으로 이동하는 함수
  const navigateToHome = () => {
    router.push('/');
  };

  return (
    <ThemedView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToHome}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors[activeTheme].text}
          />
          <ThemedText style={styles.backButtonText}>Back to Home</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText type="title" style={styles.title}>
        Frequently Asked Questions
      </ThemedText>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Collapsible title="How does the service work?">
          <ThemedText style={styles.answer}>
          Our service connects international visitors with local businesses in Korea. When you submit an inquiry, our local agents will call the business on your behalf and relay the information back to you through our chat interface.
          </ThemedText>
        </Collapsible>
        <View style={styles.hr} />
        <Collapsible title="What are the service hours?">
          <View style={[styles.serviceHoursContainer, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText style={styles.serviceHoursTitle}>
              Service Hours
            </ThemedText>
            <ThemedText style={styles.serviceHoursText}>
              Our agents are available:
            </ThemedText>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Monday - Friday: 9:00 AM - 10:00 PM KST
              </ThemedText>
            </View>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Saturday - Sunday: 10:00 AM - 8:00 PM KST
              </ThemedText>
            </View>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Holidays: 10:00 AM - 6:00 PM KST
              </ThemedText>
            </View>
            <ThemedText style={styles.noticeText}>
              Response times may vary during peak hours or holidays.
            </ThemedText>
          </View>
        </Collapsible>
        <View style={styles.hr} />
        <Collapsible title="How long does it take to get a response?">
          <ThemedText style={styles.answer}>
            We typically respond to inquiries within 15-30 minutes during our
            service hours. For complex requests or during peak hours, it may
            take up to 1 hour.
          </ThemedText>
        </Collapsible>
        <View style={styles.hr} />
        <Collapsible title="Is this service free?">
          <ThemedText style={styles.answer}>
            Basic inquiries and reservations are free. Premium services like
            urgent requests or special arrangements may incur additional fees
            which will be clearly communicated before proceeding.
          </ThemedText>
        </Collapsible>
        <View style={styles.hr} />
        <Collapsible title="What languages are supported?">
          <ThemedText style={styles.answer}>
            We currently support English, Korean, Chinese (Simplified and
            Traditional), Japanese, Spanish, French, German, and Russian.
          </ThemedText>
        </Collapsible>
        <View style={styles.hr} />
        <Collapsible title="How is my personal information handled?">
          <ThemedText style={styles.answer}>
            We take your privacy seriously. Your personal information is
            securely stored and only shared with businesses when necessary to
            fulfill your requests. Please refer to our Privacy Policy for more
            details.
          </ThemedText>
        </Collapsible>

        {/* Support Section */}
        <View style={styles.supportContainer}>
          <View style={[styles.serviceHoursContainer, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText style={styles.serviceHoursTitle}>
              Service Hours
            </ThemedText>
            <ThemedText style={styles.serviceHoursText}>
              Our agents are available:
            </ThemedText>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Monday - Friday: 9:00 AM - 10:00 PM KST
              </ThemedText>
            </View>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Saturday - Sunday: 10:00 AM - 8:00 PM KST
              </ThemedText>
            </View>
            <View style={styles.bulletPointContainer}>
              <ThemedText style={styles.bulletPoint}>•</ThemedText>
              <ThemedText style={styles.bulletText}>
                Holidays: 10:00 AM - 6:00 PM KST
              </ThemedText>
            </View>
            <ThemedText style={styles.noticeText}>
              Response times may vary during peak hours or holidays.
            </ThemedText>
          </View>

          <ThemedText style={styles.questionText}>
            Still have questions?
          </ThemedText>
          <TouchableOpacity
            style={[styles.supportButton, { backgroundColor: supportButtonBgColor }]}
            onPress={() => {
              // 지원팀 연락 로직
              router.push("/");
            }}
          >
            <ThemedText style={styles.supportButtonText}>
              Contact Support
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Theme Settings Section */}
        <View style={styles.themeSettingsContainer}>
          <ThemedText style={styles.themeSettingsTitle}>
            앱 테마 설정
          </ThemedText>
          <ThemeToggle />
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  answer: {
    paddingVertical: 10,
    lineHeight: 20,
  },
  serviceHoursContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  serviceHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceHoursText: {
    marginBottom: 8,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
  },
  bulletText: {
    flex: 1,
  },
  noticeText: {
    marginTop: 10,
    fontStyle: 'italic',
    fontSize: 12,
    color: '#666666',
  },
  hr: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  supportContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  supportText: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  supportButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  questionText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeSettingsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  themeSettingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
});