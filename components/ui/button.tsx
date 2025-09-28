import { TouchableOpacity } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  className = '',
  onPress,
  disabled = false,
  ...props
}: ButtonProps) {
  const disabledStyle = disabled ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex-row gap-2 bg-primary justify-center items-center rounded-md py-4 px-4 ${disabledStyle} ${className}`}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
