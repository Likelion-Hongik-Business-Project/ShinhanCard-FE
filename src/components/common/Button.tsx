import React from "react";

export type ButtonType =
  | "default"
  | "active"
  | "done"
  | "ghost"
  | "heart"
  | "export"
  | "none"; // 커스텀용 타입

export type ButtonColor = "blue" | "green" | "gray" | "white";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: ButtonType;
  color?: ButtonColor;
  className?: string;
}

const baseStyle =
  "flex justify-center items-center gap-4 font-medium px-6 h-16 cursor-pointer rounded-[15px]";

const typeStyles: Record<ButtonType, string> = {
  default: "border border-border-gray-20 bg-white",
  active: "bg-main text-white",
  done: "bg-done text-white",
  ghost: "border border-gray-30 bg-transparent text-gray-50",
  heart: "border border-gray-30 bg-white hover:bg-gray-20",
  export: "border border-gray-20 bg-white",
  none: "",
};

const colorStyles: Partial<Record<ButtonColor, string>> = {
  blue: "text-main",
  green: "text-done",
  gray: "text-gray-50",
  white: "text-white",
};

const Button = ({
  children,
  type = "default",
  color,
  className = "",
  ...props
}: ButtonProps) => {
  const styleArray = [
    baseStyle,
    typeStyles[type],
    color && colorStyles[color],
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
