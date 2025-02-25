import style from "./StartAnalysis.module.css";
import { BiAnalyse } from "react-icons/bi";

type startAnalysisProps = {
  handleStartAnalisis: () => void;
};

export default function StartAnalysis({
  handleStartAnalisis,
}: Readonly<startAnalysisProps>) {
  return (
    <button onClick={handleStartAnalisis} className={style.startAnalysis}>
      <span className={style.startButtonText}>Start</span>
      <BiAnalyse style={{ fontSize: "40px" }} />
    </button>
  );
}
