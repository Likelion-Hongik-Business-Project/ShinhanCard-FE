import React from "react";

export type ButtonType =
  | "default"
  | "white"
  | "green"
  | "blue"
  | "done"
  | "none";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType?: ButtonType;
  className?: string;
}

const baseStyle =
  "flex justify-center items-center gap-4 text-heading3 px-6 h-16 cursor-pointer rounded-[15px]";

const typeStyles: Record<ButtonType, string> = {
  default: "border border-gray-20 bg-white hover:bg-gray-20",
  white: "border border-gray-30 bg-white hover:bg-gray-20",
  done: "border-gray-40 border bg-gray-20 text-gray-80",
  green: "bg-state-done-03 text-white hover:text-gray-30",
  blue: "bg-main text-white hover:bg-main-dark hover:text-gray-30",
  none: "",
};

const Button = ({
  children,
  buttonType = "default",
  className = "",
  ...props
}: ButtonProps) => {
  const styleArray = [baseStyle, typeStyles[buttonType], className];
  const combinedClassName = styleArray.filter(Boolean).join(" ");

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
