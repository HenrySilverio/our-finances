import { ButtonProps } from '../interfaces/Button.interface';
import React from 'react';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-blue-lighter disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-dark-blue text-text-on-dark hover:bg-dark-blue-lighter focus:ring-dark-blue',
    secondary:
      'bg-off-white text-dark-blue hover:bg-off-white-darker focus:ring-off-white-darker',
    outline:
      'bg-transparent border border-dark-blue text-dark-blue hover:bg-off-white-lighter focus:ring-dark-blue',
    text: 'bg-transparent text-dark-blue hover:bg-off-white-lighter focus:ring-dark-blue',
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-6 py-3 rounded-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};
