import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Interview, Tag, SearchResult } from '@/types/interview';
import { interviewApi } from '@/lib/api';

interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  loading: boolean;
  error: string | null;
  currentTime: number;
  isPlaying: boolean;
  tags: Tag[];
  searchResults: SearchResult[];
  searchQuery: string;
  selectedText: string;
  selectedRange: { start: number; end: number } | null;
}

const initialState: InterviewState = {
  interviews: [],
  currentInterview: null,
  loading: false,
  error: null,
  currentTime: 0,
  isPlaying: false,
  tags: [],
  searchResults: [],
  searchQuery: '',
  selectedText: '',
  selectedRange: null,
};

// Async thunks
export const fetchInterviews = createAsyncThunk(
  'interview/fetchInterviews',
  async () => {
    const response = await interviewApi.getInterviews();
    return response;
  }
);

export const uploadInterview = createAsyncThunk(
  'interview/uploadInterview',
  async (file: File) => {
    const response = await interviewApi.uploadInterview(file);
    return response;
  }
);

export const fetchInterview = createAsyncThunk(
  'interview/fetchInterview',
  async (id: string) => {
    const response = await interviewApi.getInterview(id);
    return response;
  }
);

export const transcribeInterview = createAsyncThunk(
  'interview/transcribeInterview',
  async (id: string) => {
    const response = await interviewApi.transcribeInterview(id);
    return { id, response };
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentInterview: (state, action: PayloadAction<Interview | null>) => {
      state.currentInterview = action.payload;
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResults = action.payload;
    },
    setSelectedText: (state, action: PayloadAction<string>) => {
      state.selectedText = action.payload;
    },
    setSelectedRange: (state, action: PayloadAction<{ start: number; end: number } | null>) => {
      state.selectedRange = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload || [];
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interviews';
      })
      .addCase(uploadInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadInterview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.interviews.unshift(action.payload);
        }
      })
      .addCase(uploadInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload interview';
      })
      .addCase(fetchInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload;
      })
      .addCase(fetchInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch interview';
      })
      .addCase(transcribeInterview.fulfilled, (state, action) => {
        const interview = state.interviews.find(i => i.id === action.payload.id);
        if (interview) {
          interview.status = 'processing';
        }
      });
  },
});

export const {
  setCurrentTime,
  setIsPlaying,
  setCurrentInterview,
  addTag,
  removeTag,
  setSearchQuery,
  setSearchResults,
  setSelectedText,
  setSelectedRange,
  clearSearch,
} = interviewSlice.actions;

export default interviewSlice.reducer;
