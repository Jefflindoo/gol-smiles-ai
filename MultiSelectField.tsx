
import React from 'react';

interface MultiSelectFieldProps {
  label: string;
  options: { value: string; label: string; icon: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  required = false,
}) => {
  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">
        {label} {required && <span className="text-[#FF671B]">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleOption(opt.value)}
              className={`flex flex-col items-center justify-center p-5 rounded-[1.5rem] border-2 transition-all duration-300 gap-2 ${
                isSelected 
                  ? 'bg-[#FF671B] border-[#FF671B] text-white shadow-lg shadow-orange-100 scale-[1.02]' 
                  : 'bg-white border-gray-50 text-gray-400 hover:border-orange-100 hover:text-gray-600'
              }`}
            >
              <i className={`fas ${opt.icon} ${isSelected ? 'text-white' : 'text-[#FF671B] opacity-50'} text-xl`}></i>
              <span className="text-[10px] font-black uppercase tracking-tight">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectField;
