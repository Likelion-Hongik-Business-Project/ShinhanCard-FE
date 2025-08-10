export interface HomeButtonProps {
  type: string;
  count: number;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
  onClick: (type: string) => void;
}
