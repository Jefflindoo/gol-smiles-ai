
import React from 'react';

interface DateInputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  value,
  onChange,
  required = false
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    let masked = val;
    if (val.length > 2) masked = `${val.slice(0, 2)}/${val.slice(2)}`;
    if (val.length > 4) masked = `${masked.slice(0, 5)}/${val.slice(4)}`;
    onChange(masked);
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">
        {label} {required && <span className="text-[#FF671B]">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <i className="fas fa-calendar-alt text-sm"></i>
        </div>
        <input
          type="text"
          maxLength={10}
          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[#121B33] focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF671B] outline-none transition-all duration-300 font-semibold text-sm placeholder:text-gray-300 shadow-sm"
          placeholder="DD/MM/AAAA"
          value={value}
          onChange={handleDateChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default DateInputField;
