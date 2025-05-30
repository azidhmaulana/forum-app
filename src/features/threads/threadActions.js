import { createAsyncThunk } from '@reduxjs/toolkit';
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
  getAllThreadsWithUser,
} from './services/threadsApi';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(showLoading());
    try {
      const threads = await getAllThreadsWithUser();
      return threads;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengambil data threads';
      return rejectWithValue(message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const thread = await getThreadDetail(id);
      return thread;
    } catch (err) {
      const message = err.message || 'Gagal mengambil detail thread';
      return rejectWithValue(message);
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category, token }, { rejectWithValue }) => {
    try {
      const thread = await createThreadApi({ title, body, category, token });
      return thread;
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membuat thread';
      return rejectWithValue(message);
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
      const message = error.response?.data?.message || 'Gagal mengirim komentar';
      return rejectWithValue(message);
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
      const message = err.response?.data?.message || 'Gagal melakukan upvote thread';
      return rejectWithValue(message);
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
      const message = err.response?.data?.message || 'Gagal melakukan downvote thread';
      return rejectWithValue(message);
    }
  }
);

export const voteNeutralThread = createAsyncThunk(
  'threads/voteNeutralThread',
  async ({ id, token, userId }, { rejectWithValue }) => {
    try {
      await neutralVoteThread({ id, token });
      return { id, userId };
    } catch (err) {
      const message = err.message || 'Gagal melakukan vote netral';
      return rejectWithValue(message);
    }
  }
);

export const voteUpComment = createAsyncThunk(
  'threads/voteUpComment',
  async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
    try {
      await upvoteComment({ threadId, commentId, token });
      return { threadId, commentId, userId };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal upvote komentar';
      return rejectWithValue(message);
    }
  }
);

export const voteDownComment = createAsyncThunk(
  'threads/voteDownComment',
  async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
    try {
      await downvoteComment({ threadId, commentId, token });
      return { threadId, commentId, userId };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal downvote komentar';
      return rejectWithValue(message);
    }
  }
);

export const voteNeutralComment = createAsyncThunk(
  'threads/voteNeutralComment',
  async ({ threadId, commentId, token, userId }, { rejectWithValue }) => {
    try {
      await neutralVoteComment({ threadId, commentId, token });
      return { threadId, commentId, userId };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal netral vote komentar';
      return rejectWithValue(message);
    }
  }
);
