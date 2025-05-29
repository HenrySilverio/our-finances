export interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  onProfileClick?: () => void;
  userName?: string;
  userAvatar?: string;
  navItems?: Array<{
    label: string;
    href: string;
    active?: boolean;
    icon?: React.ReactNode;
  }>;
}
