import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllThreads,
  getThreadDetail,
  postComment as postCommentAPI,
  createThread as createThreadApi,
  upvoteThread,
  downvoteThread
} from './services/threadsApi';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const threads = await getAllThreads();
      return threads;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data threads');
    }
  }
);

export const fetchThreadDetail = createAsyncThunk('threads/fetchThreadDetail', async (id) => {
  return await getThreadDetail(id);
});

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category, token }, { rejectWithValue }) => {
    try {
      const thread = await createThreadApi({ title, body, category, token });
      return thread;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Gagal membuat thread');
    }
  }
);

export const postComment = createAsyncThunk(
  'threads/postComment',
  async ({ threadId, content, token }, { rejectWithValue }) => {
    try {
      const comment = await postCommentAPI({ threadId, content, token });
      return comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengirim komentar');
    }
  }
);

export const voteUpThread = createAsyncThunk(
  'threads/voteUpThread',
  async ({ id, token, userId }, { rejectWithValue }) => {
    try {
      await upvoteThread({ id, token });
      return { id, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const voteDownThread = createAsyncThunk(
  'threads/voteDownThread',
  async ({ id, token, userId }, { rejectWithValue }) => {
    try {
      await downvoteThread({ id, token });
      return { id, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        if (state.detail) {
          state.detail.comments.push(action.payload);
        }
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(voteUpThread.fulfilled, (state, action) => {
        const { id, userId } = action.payload;
        const thread = state.items.find((t) => t.id === id);
        if (thread) {
          if (thread.upVotesBy.includes(userId)) {
            thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId); // netral
          } else {
            thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId);
            thread.upVotesBy = [...thread.upVotesBy, userId];
          }
        }

        if (state.detail?.id === id) {
          if (state.detail.upVotesBy.includes(userId)) {
            state.detail.upVotesBy = state.detail.upVotesBy.filter((v) => v !== userId);
          } else {
            state.detail.downVotesBy = state.detail.downVotesBy.filter((v) => v !== userId);
            state.detail.upVotesBy = [...state.detail.upVotesBy, userId];
          }
        }
      })
      .addCase(voteDownThread.fulfilled, (state, action) => {
        const { id, userId } = action.payload;
        const thread = state.items.find((t) => t.id === id);
        if (thread) {
          if (thread.downVotesBy.includes(userId)) {
            thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId); // netral
          } else {
            thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId);
            thread.downVotesBy = [...thread.downVotesBy, userId];
          }
        }

        if (state.detail?.id === id) {
          if (state.detail.downVotesBy.includes(userId)) {
            state.detail.downVotesBy = state.detail.downVotesBy.filter((v) => v !== userId);
          } else {
            state.detail.upVotesBy = state.detail.upVotesBy.filter((v) => v !== userId);
            state.detail.downVotesBy = [...state.detail.downVotesBy, userId];
          }
        }
      });
  },
});

export default threadsSlice.reducer;
