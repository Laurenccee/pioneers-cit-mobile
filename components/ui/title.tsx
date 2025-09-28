import { Text, TextProps } from 'react-native';

interface TitleProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({
  children,
  className = '',
  ...props
}: TitleProps) {
  return (
    <Text
      style={{}}
      {...props}
      className={`font-delight-black text-primary ${className}`}
    >
      {children}
    </Text>
  );
}
