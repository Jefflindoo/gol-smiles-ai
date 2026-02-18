
import React from 'react';

interface SelectFieldProps {
  label: string;
  icon?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            <i className={`fas ${icon}`}></i>
          </div>
        )}
        <select
          className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          <option value="" disabled>Selecione uma opção...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i className="fas fa-chevron-down text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default SelectField;
