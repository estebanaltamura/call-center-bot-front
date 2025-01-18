import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const EditViewListServiceBrick = ({
  title,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="relative bg-blue-500 text-white rounded p-4 flex items-center justify-center space-x-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="absolute right-4 flex items-center space-x-2">
        <button onClick={onMoveUp} className="bg-gray-200 px-2 rounded w-[35px] h-[35px]">
          ↑
        </button>
        <button onClick={onMoveDown} className="bg-gray-200 px-2 rounded w-[35px] h-[35px]">
          ↓
        </button>
        <button onClick={onDelete} className="bg-red-600 text-white px-2 py-1 rounded">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EditViewListServiceBrick;
