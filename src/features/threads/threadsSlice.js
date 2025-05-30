import { createSlice } from '@reduxjs/toolkit';
import {
  fetchThreads,
  fetchThreadDetail,
  createThread,
  postComment,
  voteUpThread,
  voteDownThread,
  voteNeutralThread,
  voteUpComment,
  voteDownComment,
  voteNeutralComment,
} from './threadActions';

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
