// SystemPromptEditViewListBullet.tsx
import { useEffect, useRef, useState } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptProvider';

const SystemPromptEditViewListBullet = ({
  bullet,
  index,
  length,
}: {
  bullet: string;
  index: number;
  length: number;
}) => {
  const { moveUpBullets, moveDownBullets, deleteBullet, updatePrompt } = useSystemPromptContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Separamos el prompt en parte no editable y parte editable
  const [nonEditablePart, editablePart] = bullet.split(/:(.+)/, 2);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    updatePrompt(index, `${nonEditablePart}:${newValue}`);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Verificar si el contenido del textarea sobrepasa la altura visible
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.offsetHeight);
    }
  }, [prompt]);

  // Siempre scrollear hacia arriba al contraer
  useEffect(() => {
    if (!isExpanded && textRef.current) {
      textRef.current.scrollTo(0, 0);
    }
  }, [isExpanded]);

  return (
    <div className="relative bg-white border rounded p-2 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{nonEditablePart}:</span>
        <div className="flex items-center space-x-1">
          {index > 0 && (
            <button
              onClick={() => {
                setIsExpanded(false);
                moveUpBullets(index);
              }}
              className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
            >
              ↑
            </button>
          )}
          {index < length - 1 && (
            <button
              onClick={() => {
                setIsExpanded(false);
                moveDownBullets(index);
              }}
              className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
            >
              ↓
            </button>
          )}
          <button
            onClick={() => deleteBullet(index)}
            className="bg-red-600 text-white px-1 py-1 rounded w-[30px] h-[30px]"
          >
            🗑️
          </button>
        </div>
      </div>

      <textarea
        ref={textRef}
        defaultValue={editablePart || ''} // Usamos defaultValue en lugar de value para evitar overwriting en cada re-render
        onChange={handleChange}
        className={`
          w-full border p-2 rounded resize-none scroll-custom
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'overflow-auto' : 'overflow-hidden'}
        `}
        style={{
          height: isExpanded ? `${textRef.current?.scrollHeight}px` : '40px',
          maxHeight: isExpanded ? '600px' : '48px',
        }}
      />

      {isOverflowing && (
        <div className="flex justify-center">
          <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemPromptEditViewListBullet;
