import { Text, TextProps } from 'react-native';

interface ParagraphProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export default function Paragraph({
  children,
  className = '',
  ...props
}: ParagraphProps) {
  return (
    <Text style={{}} {...props} className={` ${className}`}>
      {children}
    </Text>
  );
}
