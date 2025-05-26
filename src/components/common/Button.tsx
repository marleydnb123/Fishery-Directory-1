import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
}) => {
  // Base styles for all button variants
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customBlue';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-customBlue hover:bg-customBlue/50 text-white shadow-sm',
    secondary: 'bg-customBlue hover:bg-customBlue/50 text-primary-900 shadow-sm',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    text: 'text-primary-600 hover:text-primary-800 hover:bg-primary-50',
  };
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`;
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={buttonStyles}>
        {children}
      </Link>
    );
  }
  
  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a href={href} className={buttonStyles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  // Otherwise render as button
  return (
    <button 
      type={type} 
      className={buttonStyles} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;