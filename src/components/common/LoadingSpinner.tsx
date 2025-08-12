import clsx from "clsx";

type Props = {
  size?: number;
  fullscreen?: boolean;
  className?: string;
  label?: string;
};

const LoadingSpinner = ({
  size = 48,
  fullscreen = false,
  className,
  label = "로딩 중",
}: Props) => {
  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx("loader", className)}
      style={{ width: size, height: size }}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
