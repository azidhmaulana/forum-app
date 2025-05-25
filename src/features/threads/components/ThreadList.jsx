import React from 'react';
import PropTypes from 'prop-types';
import ThreadItem from './ThreadItem';

const ThreadList = ({ threads }) => {
  if (!threads.length) return <p>Tidak ada thread ditemukan.</p>;

  return (
    <>
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </>
  );
};

ThreadList.propTypes = {
  threads: PropTypes.array.isRequired,
};

export default ThreadList;