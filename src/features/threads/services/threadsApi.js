import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getThreadDetail = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/threads/${id}`);
  return response.data.data.detailThread;
};

export const postComment = async ({ threadId, content, token }) => {
  const response = await axios.post(
    `${API_BASE_URL}/threads/${threadId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data.comment;
};

export const createThread = async ({ title, body, category, token }) => {
  const response = await axios.post(
    `${API_BASE_URL}/threads`,
    { title, body, category },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data.thread;
};

export const upvoteThread = async ({ id, token }) => {
  await axios.post(
    `${API_BASE_URL}/threads/${id}/up-vote`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const downvoteThread = async ({ id, token }) => {
  await axios.post(
    `${API_BASE_URL}/threads/${id}/down-vote`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const neutralVoteThread = async ({ id, token }) => {
  const response = await axios.post(
    `${API_BASE_URL}/threads/${id}/neutral-vote`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data.vote;
};

export const upvoteComment = async ({ threadId, commentId, token }) => {
  await axios.post(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const downvoteComment = async ({ threadId, commentId, token }) => {
  await axios.post(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const neutralVoteComment = async ({ threadId, commentId, token }) => {
  const response = await fetch(
    `${API_BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Gagal menetralkan vote komentar');
  }

  const result = await response.json();
  return result.data.vote;
};

export const getAllThreadsWithUser = async () => {
  const [threadsRes, usersRes] = await Promise.all([
    axios.get(`${API_BASE_URL}/threads`),
    axios.get(`${API_BASE_URL}/users`),
  ]);

  const threads = threadsRes.data.data.threads;
  const users = usersRes.data.data.users;

  const userMap = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return threads.map((thread) => ({
    ...thread,
    owner: userMap[thread.ownerId] || { name: 'Anonim', avatar: null },
  }));
};
