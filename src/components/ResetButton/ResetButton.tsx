import { RiResetLeftFill } from "react-icons/ri";
import style from "./ResetButton.module.css";

type ResetButtonProps = {
  readonly handleReset: () => void;
};

export default function ResetButton({ handleReset }: ResetButtonProps) {
  return (
    <div className={style.resetButton} onClick={handleReset}>
      <span className={style.resetButtonText}>Reset</span>
      <RiResetLeftFill style={{ fontSize: "40px" }} />
    </div>
  );
}
