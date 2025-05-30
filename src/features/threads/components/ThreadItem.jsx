import React from 'react';
import { FiThumbsUp, FiThumbsDown, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatWaktuLalu } from '../../../utils';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { voteDownThread, voteUpThread, voteNeutralThread } from '../threadActions';

const ThreadItem = ({ thread }) => {
  if (
    !thread ||
    typeof thread !== 'object' ||
    !thread.id ||
    !thread.title ||
    !thread.body ||
    !thread.category ||
    !thread.createdAt ||
    !Array.isArray(thread.upVotesBy) ||
    !Array.isArray(thread.downVotesBy)
  ) {
    return <div className="text-red-500 text-sm">Thread tidak valid atau tidak lengkap</div>;
  }

  const { id, title, body, category, createdAt, owner, totalComments = 0 } = thread;

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const ownerName = owner?.name || 'Anonim';
  const ownerAvatar = owner?.avatar || '/default-avatar.png';

  const handleUpvote = () => {
    if (thread.upVotesBy.includes(user.id)) {
      dispatch(voteNeutralThread({ id: thread.id, token, userId: user.id }));
    } else {
      dispatch(voteUpThread({ id: thread.id, token, userId: user.id }));
    }
  };

  const handleDownvote = () => {
    if (thread.downVotesBy.includes(user.id)) {
      dispatch(voteNeutralThread({ id: thread.id, token, userId: user.id }));
    } else {
      dispatch(voteDownThread({ id: thread.id, token, userId: user.id }));
    }
  };

  return (
    <div key={id} className="border-b pb-6 mb-6">
      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">#{category}</span>

      <Link to={`/threads/${thread.id}`}>
        <h3 className="text-blue-700 font-semibold mt-2 text-lg hover:underline">{title}</h3>
      </Link>

      <div
        className="text-sm text-gray-800 mt-1 line-clamp-5"
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>

      <div className="flex items-center flex-wrap gap-4 text-xs text-gray-600 mt-3">
        <div
          onClick={handleUpvote}
          className={`cursor-pointer flex items-center gap-1 ${
            Array.isArray(thread.upVotesBy) && user?.id && thread.upVotesBy.includes(user.id)
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        >
          <FiThumbsUp />
          {thread.upVotesBy.length}
        </div>
        <div
          onClick={handleDownvote}
          className={`cursor-pointer flex items-center gap-1 ${
            Array.isArray(thread.downVotesBy) && user?.id && thread.downVotesBy.includes(user.id)
              ? 'text-red-500'
              : 'text-gray-400'
          }`}
        >
          <FiThumbsDown />
          {thread.downVotesBy.length}
        </div>
        <div className="flex items-center gap-1">
          <FiMessageCircle /> {totalComments}
        </div>
        <span>{formatWaktuLalu(createdAt)}</span>
        <div className="flex items-center gap-2">
          <img src={ownerAvatar} alt={ownerName} className="w-6 h-6 rounded-full object-cover" />
          <span className="font-medium text-gray-700">{ownerName}</span>
        </div>
      </div>
    </div>
  );
};

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
    totalComments: PropTypes.number,
  }).isRequired,
};

export default ThreadItem;
