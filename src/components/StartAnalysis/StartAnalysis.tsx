import style from "./StartAnalysis.module.css";

type startAnalysisProps = {
  handleStartAnalisis: () => void;
  isAnalysisEnabled: boolean;
};

export default function StartAnalysis({
  handleStartAnalisis,
  isAnalysisEnabled,
}: Readonly<startAnalysisProps>) {
  return (
    <button
      onClick={handleStartAnalisis}
      disabled={!isAnalysisEnabled}
      className={style.startAnalysis}
    >
      Start
    </button>
  );
}
