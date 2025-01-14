import { useEffect, useRef, useState } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptProvider';

const SystemPromptEditViewListItem = ({
  prompt,
  index,
  length,
}: {
  prompt: string;
  index: number;
  length: number;
}) => {
  const { moveUp, moveDown, deleteSystemPromptBullet, updatePrompt } = useSystemPromptContext();

  const [tempPrompt, setTempPrompt] = useState(prompt);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Split prompt into non-editable and editable parts
  const [nonEditablePart, editablePart] = prompt.split(/:(.+)/, 2);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTempPrompt(`${nonEditablePart}:${newValue}`);
    updatePrompt(index, `${nonEditablePart}:${newValue}`);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.offsetHeight);
    }
  }, [tempPrompt]);

  useEffect(() => {
    textRef.current && textRef.current.scrollTo(0, 0);
  }, [isExpanded, textRef.current]);

  return (
    <div className="relative bg-white border rounded p-2 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {/* Non-editable part in bold */}
        <span className="font-bold">{nonEditablePart}:</span>
        <div className="flex items-center space-x-1">
          {index !== 0 && (
            <button
              onClick={() => moveUp(index)}
              className="bg-gray-200 px-2  rounded items-center justify-center w-[35px] h-[35px]"
            >
              ↑
            </button>
          )}
          {index !== length - 1 && (
            <button
              onClick={() => moveDown(index)}
              className="bg-gray-200 px-2  rounded items-center justify-center w-[35px] h-[35px]"
            >
              ↓
            </button>
          )}
          <button
            onClick={() => deleteSystemPromptBullet(index)}
            className="bg-red-600 text-white px-1 py-1 rounded flex items-center justify-center w-[35px] h-[35px]"
          >
            🗑️
          </button>
        </div>
      </div>
      {/* Editable textarea below occupying full width */}
      <textarea
        ref={textRef}
        value={editablePart}
        onChange={handleChange}
        className={`
          w-full border p-2 rounded resize-none scroll-custom
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'overflow-auto' : 'overflow-hidden'}
        `}
        style={{
          height: isExpanded ? `${textRef.current?.scrollHeight}px` : '40px',
          maxHeight: isExpanded ? '600px' : '48px',
          transition: 'height 0.3s ease-in-out',
        }}
      />
      {isOverflowing && (
        <div className="flex justify-center mt-1">
          <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemPromptEditViewListItem;
