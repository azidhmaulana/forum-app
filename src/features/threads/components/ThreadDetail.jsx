import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail,
  postComment,
  voteUpThread,
  voteDownThread,
  voteUpComment,
  voteDownComment,
  voteNeutralThread,
  voteNeutralComment
} from '../threadsSlice';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { formatWaktuLalu } from '../../../utils';

const ThreadDetail = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const { detail: thread } = useSelector((state) => state.threads);

  const { token, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    console.log('trigger fetchThreadDetail');
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  if (!thread) return <p className="text-center">Thread tidak ditemukan.</p>;

  const handleCommentUpvote = (comment) => {
    if (!token) return alert('Login untuk vote');
    const payload = { threadId, commentId: comment.id, token, userId };
    if (comment.upVotesBy.includes(userId)) {
      dispatch(voteNeutralComment(payload));
    } else {
      dispatch(voteUpComment(payload));
    }
  };

  const handleCommentDownvote = (comment) => {
    if (!token) return alert('Login untuk vote');
    const payload = { threadId, commentId: comment.id, token, userId };
    if (comment.downVotesBy.includes(userId)) {
      dispatch(voteNeutralComment(payload));
    } else {
      dispatch(voteDownComment(payload));
    }
  };

  const handleUpvote = () => {
    if (thread.upVotesBy.includes(user.id)) {
      // Sudah upvote → netral
      dispatch(voteNeutralThread({ id: thread.id, token, userId: user.id }));
    } else {
      dispatch(voteUpThread({ id: thread.id, token, userId: user.id }));
    }
  } ;

  const handleDownvote = () => {
    if (thread.downVotesBy.includes(user.id)) {
      // Sudah downvote → netral
      dispatch(voteNeutralThread({ id: thread.id, token, userId: user.id }));
    } else {
      dispatch(voteDownThread({ id: thread.id, token, userId: user.id }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-gray-100 min-h-screen">
      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
        #{thread.category}
      </span>
      <h1 className="text-gray-900 font-bold text-2xl mt-2">{thread.title}</h1>

      <div className="text-gray-800 mt-2 prose" dangerouslySetInnerHTML={{ __html: thread.body }}></div>

      <div className="flex items-center text-sm text-gray-600 mt-4 gap-4">
        <div
          onClick={handleUpvote}
          className={`cursor-pointer flex items-center gap-1 ${
            thread.upVotesBy.includes(user.id) ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <FiThumbsUp />
          {thread.upVotesBy.length}
        </div>
        <div
          onClick={handleDownvote}
          className={`flex items-center gap-1 cursor-pointer ${
            thread.downVotesBy.includes(user.id) ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <FiThumbsDown />
          {thread.downVotesBy.length}
        </div>
        <div className="flex items-center gap-2">
          {thread.owner.avatar && (
            <img
              src={thread.owner.avatar}
              alt={thread.owner.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="font-medium text-gray-700">Dibuat oleh <strong>{thread.owner.name}</strong></span>
        </div>
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
            <p className="text-sm mt-1 text-gray-800" dangerouslySetInnerHTML={{ __html: comment.content }}></p>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
              <span
                className={`flex items-center gap-1 cursor-pointer ${
                  comment.upVotesBy.includes(userId) ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => handleCommentUpvote(comment)}
              >
                <FiThumbsUp /> {comment.upVotesBy.length}
              </span>

              <span
                className={`flex items-center gap-1 cursor-pointer ${
                  comment.downVotesBy.includes(userId) ? 'text-red-600' : 'text-gray-400'
                }`}
                onClick={() => handleCommentDownvote(comment)}
              >
                <FiThumbsDown /> {comment.downVotesBy.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreadDetail;
