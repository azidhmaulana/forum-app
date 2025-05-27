import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getThreadDetail,
  postComment as postCommentAPI,
  createThread as createThreadApi,
  upvoteThread,
  downvoteThread,
  neutralVoteThread,
  upvoteComment,
  downvoteComment,
  neutralVoteComment,
  getAllThreadsWithUser
} from './services/threadsApi';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads', async (_, { rejectWithValue, dispatch }) => {
    dispatch(showLoading());
    try {
      const threads = await getAllThreadsWithUser();
      return threads;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengambil data threads');
    } finally {
      dispatch(hideLoading());
    }
  });

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const thread = await getThreadDetail(id);
      return thread;
    } catch (err) {
      return rejectWithValue(err.message || 'Gagal mengambil detail thread');
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const createThread = createAsyncThunk('threads/createThread', async ({ title, body, category, token }, { rejectWithValue }) => {
  try {
    const thread = await createThreadApi({ title, body, category, token });
    return thread;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Gagal membuat thread');
  }
});

export const postComment = createAsyncThunk('threads/postComment', async ({ threadId, content, token }, { rejectWithValue }) => {
  try {
    const comment = await postCommentAPI({ threadId, content, token });
    return comment;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal mengirim komentar');
  }
});

export const voteUpThread = createAsyncThunk('threads/voteUpThread', async ({ id, token, userId }, { rejectWithValue }) => {
  try {
    await upvoteThread({ id, token });
    return { id, userId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const voteDownThread = createAsyncThunk('threads/voteDownThread', async ({ id, token, userId }, { rejectWithValue }) => {
  try {
    await downvoteThread({ id, token });
    return { id, userId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const voteNeutralThread = createAsyncThunk(
  'threads/voteNeutralThread',
  async ({ id, token, userId }, { rejectWithValue }) => {
    try {
      await neutralVoteThread({ id, token });
      return { id, userId };
    } catch (err) {
      return rejectWithValue(err.message || 'Gagal melakukan vote netral');
    }
  }
);

export const voteUpComment = createAsyncThunk('threads/voteUpComment', async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
  try {
    await upvoteComment({ threadId, commentId, token });
    return { threadId, commentId, userId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const voteDownComment = createAsyncThunk('threads/voteDownComment', async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
  try {
    await downvoteComment({ threadId, commentId, token });
    return { threadId, commentId, userId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const voteNeutralComment = createAsyncThunk(
  'threads/voteNeutralComment',
  async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
    try {
      await neutralVoteComment({ threadId, commentId, token });
      return { threadId, commentId, userId };
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
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(postComment.fulfilled, (state, action) => {
        if (state.detail) state.detail.comments.push(action.payload);
      })

      .addCase(voteUpThread.pending, (state, action) => {
        const { id, userId } = action.meta.arg;
        const thread = state.items.find((t) => t.id === id);
        if (thread) {
          thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId);
          if (!thread.upVotesBy.includes(userId)) thread.upVotesBy.push(userId);
          else thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId);
        }
        if (state.detail?.id === id) {
          state.detail.downVotesBy = state.detail.downVotesBy.filter((v) => v !== userId);
          if (!state.detail.upVotesBy.includes(userId)) state.detail.upVotesBy.push(userId);
          else state.detail.upVotesBy = state.detail.upVotesBy.filter((v) => v !== userId);
        }
      })
      .addCase(voteUpThread.rejected, (state, action) => {
        const { id, userId } = action.meta.arg;
        const thread = state.items.find((t) => t.id === id);
        if (thread) thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId);
      })
      .addCase(voteDownThread.pending, (state, action) => {
        const { id, userId } = action.meta.arg;
        const thread = state.items.find((t) => t.id === id);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId);
          if (!thread.downVotesBy.includes(userId)) thread.downVotesBy.push(userId);
          else thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId);
        }
        if (state.detail?.id === id) {
          state.detail.upVotesBy = state.detail.upVotesBy.filter((v) => v !== userId);
          if (!state.detail.downVotesBy.includes(userId)) state.detail.downVotesBy.push(userId);
          else state.detail.downVotesBy = state.detail.downVotesBy.filter((v) => v !== userId);
        }
      })
      .addCase(voteDownThread.rejected, (state, action) => {
        const { id, userId } = action.meta.arg;
        const thread = state.items.find((t) => t.id === id);
        if (thread) thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId);
      })
      .addCase(voteUpComment.pending, (state, action) => {
        const { commentId, userId } = action.meta.arg;
        const comment = state.detail?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.downVotesBy = comment.downVotesBy.filter((v) => v !== userId);
          if (!comment.upVotesBy.includes(userId)) comment.upVotesBy.push(userId);
          else comment.upVotesBy = comment.upVotesBy.filter((v) => v !== userId);
        }
      })
      .addCase(voteUpComment.rejected, (state, action) => {
        const { commentId, userId } = action.meta.arg;
        const comment = state.detail?.comments.find((c) => c.id === commentId);
        if (comment) comment.upVotesBy = comment.upVotesBy.filter((v) => v !== userId);
      })
      .addCase(voteDownComment.pending, (state, action) => {
        const { commentId, userId } = action.meta.arg;
        const comment = state.detail?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((v) => v !== userId);
          if (!comment.downVotesBy.includes(userId)) comment.downVotesBy.push(userId);
          else comment.downVotesBy = comment.downVotesBy.filter((v) => v !== userId);
        }
      })
      .addCase(voteDownComment.rejected, (state, action) => {
        const { commentId, userId } = action.meta.arg;
        const comment = state.detail?.comments.find((c) => c.id === commentId);
        if (comment) comment.downVotesBy = comment.downVotesBy.filter((v) => v !== userId);
      })
      .addCase(voteNeutralThread.fulfilled, (state, action) => {
        const { id, userId } = action.payload;
        const thread = state.items.find((t) => t.id === id);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((v) => v !== userId);
          thread.downVotesBy = thread.downVotesBy.filter((v) => v !== userId);
        }
        if (state.detail?.id === id) {
          state.detail.upVotesBy = state.detail.upVotesBy.filter((v) => v !== userId);
          state.detail.downVotesBy = state.detail.downVotesBy.filter((v) => v !== userId);
        }
      })
      .addCase(voteNeutralComment.fulfilled, (state, action) => {
        const { commentId, userId } = action.payload;
        const comment = state.detail?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((v) => v !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((v) => v !== userId);
        }
      });
  },
});

export default threadsSlice.reducer;
