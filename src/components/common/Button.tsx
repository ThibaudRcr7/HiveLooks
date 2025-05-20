import { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from 'react';

type PolymorphicButtonProps<C extends ElementType> = {
  as?: C;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'variant' | 'size' | 'isLoading' | 'className'>;

const Button = <C extends ElementType = 'button'>(
  props: PropsWithChildren<PolymorphicButtonProps<C>>
) => {
  const {
    as,
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...rest
  } = props;

  const Component = as || 'button';
  const baseStyles = 'font-bold rounded-lg border-[1px] border-hive-black transition-all duration-200';
  
  const variants = {
    primary: 'bg-hive-pink text-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none',
    secondary: 'bg-hive-orange text-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none',
    outline: 'bg-transparent text-hive-black border-2 hover:bg-hive-black/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const loadingStyles = isLoading ? 'opacity-75 cursor-not-allowed' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:transform-none' : '';

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${loadingStyles} ${disabledStyles} ${className}`}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-hive-black"></div>
        </div>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;