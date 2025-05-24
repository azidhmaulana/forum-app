import React from 'react';
import ThreadItem from './ThreadItem';
import { useSelector } from 'react-redux';

const ThreadList = () => {
  const { items: threads, loading, error } = useSelector((state) => state.threads);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </>
  );
};

export default ThreadList;
