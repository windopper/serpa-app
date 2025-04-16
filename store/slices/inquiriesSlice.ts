import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export type InquiryStatus = 'Answered' | 'Waiting' | 'In Progress' | 'Closed';

export interface Inquiry {
  id: number;
  place: string;
  category: string;
  status: InquiryStatus;
  date: string;
  businessId?: number;
  description?: string;
  chatSessionId?: number; // 연결된 채팅 세션 ID
}

interface InquiriesState {
  items: Inquiry[];
  selectedInquiryId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: InquiriesState = {
  items: [
    {
      id: 1,
      place: 'Seoul BBQ Restaurant',
      category: 'Reservation',
      status: 'Answered',
      date: '4월 12일',
      chatSessionId: 1
    },
    {
      id: 2,
      place: 'Hongdae Coffee Shop',
      category: 'Business Hours',
      status: 'Waiting',
      date: '4월 13일',
      chatSessionId: 2
    },
    {
      id: 3,
      place: 'Gangnam Hair Salon',
      category: 'Waiting List',
      status: 'In Progress',
      date: '4월 14일',
      chatSessionId: 3
    },
    {
      id: 4,
      place: 'Myeongdong Shopping Mall',
      category: 'Other',
      status: 'Closed',
      date: '4월 10일',
      chatSessionId: 4
    }
  ],
  selectedInquiryId: null,
  loading: false,
  error: null,
};

// 비동기 작업을 위한 thunk 함수 예시
export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchInquiries',
  async (_, { rejectWithValue }) => {
    try {
      // 여기에 실제 API 호출 코드가 들어갈 예정
      // 현재는 Mock 데이터를 사용하므로 timeout으로 API 호출 시뮬레이션
      return new Promise<Inquiry[]>((resolve) => {
        setTimeout(() => {
          resolve(initialState.items);
        }, 1000);
      });
    } catch (error) {
      return rejectWithValue('문의 목록을 불러오는데 실패했습니다.');
    }
  }
);

export const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    selectInquiry: (state, action: PayloadAction<number>) => {
      state.selectedInquiryId = action.payload;
    },
    addInquiry: (state, action: PayloadAction<Partial<Inquiry>>) => {
      // action.payload에 id가 전달된 경우 그대로 사용
      const newId = action.payload.id || (state.items.length > 0 
        ? Math.max(...state.items.map(item => item.id)) + 1
        : 1);
        
      state.items.push({
        ...action.payload,
        id: newId,
      } as Inquiry);
    },
    updateInquiryStatus: (state, action: PayloadAction<{ id: number; status: InquiryStatus }>) => {
      const { id, status } = action.payload;
      const inquiry = state.items.find(item => item.id === id);
      if (inquiry) {
        inquiry.status = status;
      }
    },
    clearSelectedInquiry: (state) => {
      state.selectedInquiryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  selectInquiry, 
  addInquiry, 
  updateInquiryStatus, 
  clearSelectedInquiry 
} = inquiriesSlice.actions;

export default inquiriesSlice.reducer;