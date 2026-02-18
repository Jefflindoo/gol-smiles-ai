
import React from 'react';

interface InputFieldProps {
  label: string;
  icon?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  textarea = false,
  rows = 3
}) => {
  const inputClasses = "w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#121B33] focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF671B] outline-none transition-all duration-300 font-semibold text-sm placeholder:text-gray-300 placeholder:font-normal shadow-sm";
  
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">
        {label} {required && <span className="text-[#FF671B]">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <i className={`fas ${icon} text-sm`}></i>
          </div>
        )}
        {textarea ? (
          <textarea
            className={`${inputClasses} !pl-5 pt-4 resize-none`}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
        ) : (
          <input
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
