import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail,
  postComment,
  voteUpThread,
  voteDownThread,
} from '../threadsSlice';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { formatWaktuLalu } from '../../../utils';

const ThreadDetail = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');

  const { token, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { detail: thread, loading, error } = useSelector((state) => state.threads);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  if (loading) return <p className="text-center mt-10">Memuat detail thread...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!thread) return <p className="text-center">Thread tidak ditemukan.</p>;

  const isUpvoted = thread.upVotesBy.includes(userId);
  const isDownvoted = thread.downVotesBy.includes(userId);

  const handleUpvote = () => {
    if (!token) return alert('Login untuk vote');
    dispatch(voteUpThread({ id: thread.id, token, userId }));
  };

  const handleDownvote = () => {
    if (!token) return alert('Login untuk vote');
    dispatch(voteDownThread({ id: thread.id, token, userId }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-gray-100 min-h-screen">
      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
        #{thread.category}
      </span>
      <h1 className="text-gray-900 font-bold text-2xl mt-2">{thread.title}</h1>

      <div className="text-gray-800 mt-2 prose" dangerouslySetInnerHTML={{ __html: thread.body }}></div>

      <div className="flex items-center text-sm text-gray-600 mt-4 gap-4">
        <span
          onClick={handleUpvote}
          className={`flex items-center gap-1 cursor-pointer ${
            isUpvoted ? 'text-black' : ''
          }`}
        >
          <FiThumbsUp /> {thread.upVotesBy.length}
        </span>
        <span
          onClick={handleDownvote}
          className={`flex items-center gap-1 cursor-pointer ${
            isDownvoted ? 'text-black' : ''
          }`}
        >
          <FiThumbsDown /> {thread.downVotesBy.length}
        </span>
        <span>
          Dibuat oleh <strong>{thread.owner.name}</strong>
        </span>
        <span>{formatWaktuLalu(thread.createdAt)}</span>
      </div>

      <div className="mt-8 border-t pt-4">
        <h3 className="font-semibold text-md text-gray-800">Beri komentar</h3>
        {token ? (
          <>
            <textarea
              rows={3}
              className="w-full border rounded p-2 mt-2"
              placeholder="Tulis komentar kamu..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button
              className="mt-2 w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-800"
              onClick={() => {
                if (commentText.trim() === '') return;
                dispatch(postComment({ threadId, content: commentText, token }));
                setCommentText('');
              }}
            >
              Kirim
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 underline">Login</Link> untuk memberi komentar
          </p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-md text-gray-800">
          Komentar ({thread.comments.length})
        </h3>
        {thread.comments.map((comment) => (
          <div key={comment.id} className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="bg-green-200 text-green-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {comment.owner.name.slice(0, 2).toUpperCase()}
              </div>
              <span>{comment.owner.name}</span>
              <span className="text-gray-500 ml-auto text-xs">{formatWaktuLalu(comment.createdAt)}</span>
            </div>
            <p className="text-sm mt-1 text-gray-800">{comment.content}</p>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
              <span className="flex items-center gap-1"><FiThumbsUp /> {comment.upVotesBy.length}</span>
              <span className="flex items-center gap-1"><FiThumbsDown /> {comment.downVotesBy.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreadDetail;
