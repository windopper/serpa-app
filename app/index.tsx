import { Redirect } from 'expo-router';

export default function Index() {
  // 앱 시작 시 로그인 페이지로 리디렉션
  return <Redirect href="/login" />;
}