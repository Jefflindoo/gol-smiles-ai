
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm";
  
  const variants = {
    primary: "bg-[#FF671B] text-white hover:bg-[#E55B18] shadow-lg shadow-orange-100",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100",
    outline: "border-2 border-[#FF671B] text-[#FF671B] hover:bg-orange-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <i className="fas fa-circle-notch fa-spin"></i>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
