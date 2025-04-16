import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import SerpaLogo from "@/assets/icons/serpa_logo.svg";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { resetActiveSession } from "@/store/slices/chatSlice";

// 기본 메뉴 항목 컴포넌트
function MenuItem({ icon, title, description, onPress }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const backgroundColor = useThemeColor({}, 'card');
  const shadowColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor, shadowColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <ThemedText type="subtitle" style={styles.menuTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.menuDescription}>{description}</ThemedText>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { activeTheme } = useThemeContext();
  const tintColor = useThemeColor({}, 'tint');
  const logoColor = activeTheme === 'dark' ? 'white' : 'black';
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.logoContainer}>
          <SerpaLogo width={120} height={40} color={logoColor} />
        </View>
        <ThemedText type="title" style={styles.headerTitle}>
          Need help in Korea?
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          We connect you with local businesses when language barriers get in the
          way. No Korean phone? No problem!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        {/* 예약 메뉴 항목 */}
        <MenuItem
          icon={
            <Ionicons
              name="calendar-clear-outline"
              size={30}
              color={tintColor}
            />
          } // 실제 아이콘 이미지로 교체 필요
          title="Reservation"
          description="Make restaurant or service reservations without language barriers"
          onPress={() => {}}
        />

        {/* 영업시간 메뉴 항목 */}
        <MenuItem
          icon={
            <Ionicons
              name="time-outline"
              size={30}
              color={tintColor}
            />
          } // 실제 아이콘 이미지로 교체 필요
          title="Business Hours"
          description="Check if a place is open or when they close today"
          onPress={() => {}}
        />

        {/* 대기 리스트 메뉴 항목 */}
        <MenuItem
          icon={
            <Ionicons
              name="people-outline"
              size={30}
              color={tintColor}
            />
          } // 실제 아이콘 이미지로 교체 필요
          title="Waiting List"
          description="Ask about current wait times or get on a waiting list"
          onPress={() => {}}
        />

        {/* 기타 문의 메뉴 항목 */}
        <MenuItem
          icon={
            <Ionicons
              name="help-circle-outline"
              size={30}
              color={tintColor}
            />
          } // 실제 아이콘 이미지로 교체 필요
          title="Other Inquiries"
          description="Any other questions you need answered by local businesses"
          onPress={() => {}}
        />

        <TouchableOpacity
          style={[
            styles.startChatButton,
            { backgroundColor: tintColor },
          ]}
          activeOpacity={0.8}
          onPress={() => {
            // 기존 대화 세션을 초기화하고 새 채팅 시작
            dispatch(resetActiveSession());
            router.push("/chat");
          }}
        >
          <ThemedText style={styles.startChatButtonText}>Start Chat</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 80,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  headerSubtitle: {
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  menuContainer: {
    padding: 15,
    gap: 25,
  },
  menuItem: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  menuTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  menuDescription: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  startChatButton: {
    marginHorizontal: 80,
    marginVertical: 24,
    borderRadius: 30,
    padding: 15,
    alignItems: "center",
  },
  startChatButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
