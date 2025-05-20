import { FC, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const baseStyles = 'w-full px-3 py-2 rounded-lg border-2 border-hive-black focus:outline-none transition-colors duration-200';
  const errorStyles = error ? 'border-red-500 focus:border-red-500' : 'focus:border-hive-pink';
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold uppercase mb-2 text-hive-black"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${errorStyles} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-500 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-gray-500 mt-1"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;