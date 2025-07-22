import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "third" | "forth";
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const baseStyle = "flex justify-center items-center gap-4 font-medium px-6";

const variantStyles = {
  primary: "border border-[var(--Gray-20,#DDE2E7)]",
  secondary:
    "bg-[var(--White,#FFF)] border border-[var(--Gray-50,#8A94A0)] text-[var(--Gray-50,#8A94A0)]",
  third: "bg-[var(--Main,#19398C)]",
  forth:
    "flex h-[64px] px-[24px] justify-center items-center gap-[16px] border border-[var(--Gray-30,#C6CCD1)] bg-[var(--White,#FFF)] hover:bg-[var(--Gray-20,#DDE2E7)]",
};

const sizeStyles = {
  sm: "w-[72px] h-[64px]",
  md: "w-[263px] h-[64px] text-[20px]",
  lg: "w-[463px] h-[160px] text-[20px]",
};

const roundedStyles = {
  sm: "rounded-[4px]",
  md: "rounded-[13px]",
  lg: "rounded-[15px]",
  full: "rounded-full",
};

const Button = ({
  children,
  variant = "primary",
  size = "lg",
  rounded = "lg",
  className = "",
  ...props
}: ButtonProps) => {
  const styleArray = [
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    roundedStyles[rounded],
    className,
  ];

  const combinedClassName = styleArray.filter(Boolean).join(" ");

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
