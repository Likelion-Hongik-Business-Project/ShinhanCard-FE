interface ProgressBarProps {
  value: number;
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-46 h-2 bg-[#d9d9d9] rounded-full overflow-hidden">
      <div
        className="h-full bg-state-progress-02 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
