import { useState, useEffect } from 'react';

const FormInputField = ({
  label,
  placeholder,
  originalValue,
  setOriginialValue,
  disabled,
}: {
  label: string;
  placeholder: string;
  originalValue: { originalText: string; text: string };
  setOriginialValue: React.Dispatch<React.SetStateAction<{ originalText: string; text: string }>>;
  disabled: boolean;
}) => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleCancelValueChange = () => {
    setOriginialValue((prev) => {
      const payload = {
        ...prev,
        text: originalValue.originalText,
      };

      return payload;
    });
  };

  const handleConfirmValueChange = () => {
    setOriginialValue((prev) => {
      const payload = {
        ...prev,
        originalText: originalValue.text,
      };

      return payload;
    });
  };

  useEffect(() => {
    setHasChanges(originalValue.originalText !== originalValue.text);
  }, [originalValue]);

  return (
    <div className="mb-3">
      <span className="font-semibold block pl-2">{label}</span>
      <div className="flex gap-2">
        <input
          disabled={disabled}
          placeholder={placeholder}
          value={originalValue.text}
          onChange={(e) =>
            setOriginialValue((prev) => {
              const payload = {
                ...prev,
                text: e.target.value,
              };

              return payload;
            })
          }
          className="border rounded h-[40px] px-2 w-full"
        />
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleCancelValueChange}
              className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
            >
              ✕
            </button>
            <button
              onClick={handleConfirmValueChange}
              disabled={originalValue.text.trim() === ''}
              className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInputField;
