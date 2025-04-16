import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'business';
  timestamp: number;
}

interface ChatSession {
  id: number;
  messages: Message[];
  isActive: boolean;
  businessId?: number;
  businessName?: string;
}

interface ChatState {
  sessions: Record<number, ChatSession>;
  activeSessionId: number | null;
  loading: boolean;
  error: string | null;
}

// 샘플 메시지 생성 함수
const createMessage = (
  text: string, 
  sender: 'user' | 'system' | 'business', 
  timestamp: number,
  id?: string
): Message => ({
  id: id || timestamp.toString(),
  text,
  sender,
  timestamp
});

// 각 문의에 해당하는 샘플 채팅 데이터 생성
const sampleSessions: Record<number, ChatSession> = {
  // 1번 문의: Seoul BBQ Restaurant - 예약 (Answered)
  1: {
    id: 1,
    businessName: 'Seoul BBQ Restaurant',
    isActive: true,
    messages: [
      createMessage('안녕하세요! Seoul BBQ Restaurant 관련 문의에 대한 대화입니다. 무엇을 도와드릴까요?', 'system', Date.now() - 86400000),
      createMessage('서울 바베큐 레스토랑에 내일 저녁 6시에 4명 예약을 하고 싶습니다.', 'user', Date.now() - 86000000),
      createMessage('예약 요청을 접수했습니다. 레스토랑에 연락해보겠습니다.', 'system', Date.now() - 85500000),
      createMessage('Seoul BBQ Restaurant에 연락했습니다. 내일 저녁 6시에 4명 예약이 가능합니다. 예약자 성함이 필요합니다.', 'business', Date.now() - 83000000),
      createMessage('John Smith라고 해주세요.', 'user', Date.now() - 82000000),
      createMessage('감사합니다. John Smith 님 명의로 내일 저녁 6시에 4명 예약이 완료되었습니다. 추가 요청사항이 있으실까요?', 'business', Date.now() - 80000000),
      createMessage('창가 자리로 부탁드립니다.', 'user', Date.now() - 79000000),
      createMessage('창가 자리 요청 전달해 두었습니다. 다만 레스토랑 측에서는 가능한 한 제공하겠지만 보장은 어렵다고 합니다. 당일 빨리 도착하시면 창가 자리 배정 가능성이 높아집니다.', 'business', Date.now() - 77000000),
      createMessage('알겠습니다. 감사합니다!', 'user', Date.now() - 76000000),
      createMessage('도움이 더 필요하시면 언제든 문의해주세요. 즐거운 식사 되세요!', 'business', Date.now() - 75500000),
    ]
  },

  // 2번 문의: Hongdae Coffee Shop - 영업시간 (Waiting)
  2: {
    id: 2,
    businessName: 'Hongdae Coffee Shop',
    isActive: true,
    messages: [
      createMessage('안녕하세요! Hongdae Coffee Shop 관련 문의에 대한 대화입니다. 무엇을 도와드릴까요?', 'system', Date.now() - 50400000),
      createMessage('홍대 커피숍의 영업시간이 어떻게 되나요? 오늘 늦게 방문할 예정인데 몇시까지 영업하는지 알고 싶습니다.', 'user', Date.now() - 50000000),
      createMessage('영업시간 확인을 위해 Hongdae Coffee Shop에 연락해보겠습니다. 잠시만 기다려주세요.', 'system', Date.now() - 49500000),
      createMessage('문의해주셔서 감사합니다. 현재 담당자가 확인 중입니다. 가능한 빨리 답변 드리겠습니다.', 'system', Date.now() - 45000000),
    ]
  },

  // 3번 문의: Gangnam Hair Salon - 대기 리스트 (In Progress)
  3: {
    id: 3,
    businessName: 'Gangnam Hair Salon',
    isActive: true,
    messages: [
      createMessage('안녕하세요! Gangnam Hair Salon 관련 문의에 대한 대화입니다. 무엇을 도와드릴까요?', 'system', Date.now() - 36000000),
      createMessage('강남 헤어살롱에 오늘 컷트 예약없이 방문하면 얼마나 기다려야 할까요?', 'user', Date.now() - 35500000),
      createMessage('Gangnam Hair Salon에 현재 대기 상황을 문의해보겠습니다.', 'system', Date.now() - 35000000),
      createMessage('현재 살롱에 연락 중입니다. 잠시만 기다려주세요.', 'system', Date.now() - 34800000),
      createMessage('Gangnam Hair Salon에 확인해봤습니다. 현재 대기 인원은 약 5명이며, 예상 대기 시간은 1시간 30분 정도입니다. 다만 헤어 디자이너에 따라 대기 시간이 다를 수 있습니다.', 'business', Date.now() - 33000000),
      createMessage('혹시 특정 디자이너를 요청하고 싶으시면 알려주세요. 또는 대기 리스트에 이름을 올려드릴까요?', 'business', Date.now() - 32900000),
      createMessage('Anna 디자이너가 가능하다면 그분에게 하고 싶은데, 그분의 대기 시간은 어떻게 되나요?', 'user', Date.now() - 32000000),
      createMessage('Anna 디자이너의 가능 여부와 대기 시간을 확인해보겠습니다.', 'business', Date.now() - 31500000),
    ]
  },

  // 4번 문의: Myeongdong Shopping Mall - 기타 (Closed)
  4: {
    id: 4,
    businessName: 'Myeongdong Shopping Mall',
    isActive: true,
    messages: [
      createMessage('안녕하세요! Myeongdong Shopping Mall 관련 문의에 대한 대화입니다. 무엇을 도와드릴까요?', 'system', Date.now() - 172800000),
      createMessage('명동 쇼핑몰에서 외국인 관광객을 위한 택스 리펀드가 가능한가요?', 'user', Date.now() - 172000000),
      createMessage('Myeongdong Shopping Mall의 택스 리펀드 서비스 가능 여부를 확인해보겠습니다.', 'system', Date.now() - 171500000),
      createMessage('쇼핑몰 측에 확인한 결과, 명동 쇼핑몰 3층에 택스 리펀드 서비스 센터가 있습니다. 영업시간은 오전 10시부터 오후 8시까지입니다.', 'business', Date.now() - 169000000),
      createMessage('택스 리펀드를 받기 위해서는 여권과 구매 영수증이 필요하며, 물품 구매 금액이 총 30,000원 이상이어야 합니다.', 'business', Date.now() - 168900000),
      createMessage('감사합니다. 마지막으로 공항에서도 환급이 가능한가요?', 'user', Date.now() - 168000000),
      createMessage('네, 공항에서도 환급이 가능합니다. 출국장 내에 택스 리펀드 카운터가 있으며, 쇼핑몰에서 받은 환급 서류를 제출하시면 됩니다. 단, 물품 검사가 필요할 수 있으므로 체크인 전에 택스 리펀드를 받으시는 것이 좋습니다.', 'business', Date.now() - 166000000),
      createMessage('정보 감사합니다. 도움이 많이 됐습니다.', 'user', Date.now() - 165000000),
      createMessage('도움이 되어 다행입니다. 즐거운 쇼핑 되세요! 추가 문의사항이 있으시면 언제든지 물어봐주세요.', 'business', Date.now() - 164000000),
    ]
  }
};

const initialState: ChatState = {
  sessions: sampleSessions,
  activeSessionId: null,
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createSession: (state, action: PayloadAction<{ 
      sessionId: number, 
      businessId?: number,
      businessName?: string 
    }>) => {
      const { sessionId, businessId, businessName } = action.payload;
      state.sessions[sessionId] = {
        id: sessionId,
        messages: [],
        isActive: true,
        businessId,
        businessName,
      };
      state.activeSessionId = sessionId;
    },
    resetActiveSession: (state) => {
      // 현재 활성화된 세션을 초기화하고 새 세션 시작을 준비합니다
      state.activeSessionId = null;
    },
    setActiveSession: (state, action: PayloadAction<number>) => {
      state.activeSessionId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ 
      sessionId: number, 
      message: Omit<Message, 'id'> 
    }>) => {
      const { sessionId, message } = action.payload;
      if (state.sessions[sessionId]) {
        state.sessions[sessionId].messages.push({
          ...message,
          id: Date.now().toString(),
        });
      }
    },
    closeSession: (state, action: PayloadAction<number>) => {
      if (state.sessions[action.payload]) {
        state.sessions[action.payload].isActive = false;
        
        // 닫힌 세션이 현재 활성 세션이면 활성 세션을 null로 설정
        if (state.activeSessionId === action.payload) {
          state.activeSessionId = null;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  createSession,
  resetActiveSession,
  setActiveSession,
  addMessage,
  closeSession,
  clearError,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;