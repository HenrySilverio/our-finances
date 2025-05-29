export interface CardProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  variant: 'default' | 'outlined' | 'elevated';
}
