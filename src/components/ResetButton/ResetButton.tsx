import style from "./ResetButton.module.css";

type ResetButtonProps = {
  readonly handleReset: () => void;
  readonly isResetEnabled: boolean;
};

export default function ResetButton({
  handleReset,
  isResetEnabled,
}: ResetButtonProps) {
  return (
    <button
      className={style.resetButton}
      disabled={!isResetEnabled}
      onClick={handleReset}
    >
      Reset
    </button>
  );
}
