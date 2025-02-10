import { RiResetLeftFill } from "react-icons/ri";
import style from "./App.module.css";
import { useState } from "react";
import { dataSeat as initialDataSeat } from "./utils/data";
function App() {
  const [dataSeat, setDataSeat] = useState(initialDataSeat);
  return (
    <main className="App">
      <div className={style.table}>
        <img
          className={style.imgTable}
          src="/assets/table-poker.jpg"
          alt="poker table"
        />
        <div
          style={{
            position: "absolute",
            bottom: "225px",
            left: "30px",
            color: "white",
            cursor: "pointer",
          }}
          // onClick={onReset}
        >
          <span
            style={{
              fontSize: "15px",
              position: "absolute",
              left: "0px",
              bottom: "-10px",
            }}
          >
            Reset
          </span>
          <RiResetLeftFill style={{ fontSize: "40px" }} />
        </div>
        <div className={style.boardContainer}>{/* <Board /> */}</div>
        {dataSeat.map((data) => (
          // <Seat key={data.id} id={data.id} posX={data.posX} posY={data.posY} />
          <div
            key={data.id}
            id={`player-${data.id}`}
            className={style.seat}
            style={{
              left: `${data.posX}px`,
              top: `${data.posY}px`,
            }}
          >
            <div className={style.id}>player {data.id}</div>
            <div className={style.cardContainer}>
              <div className={style.card}></div>
              <div className={style.card}></div>
              {/* <Placeholder id={`player-${data.id}-card-1`} />
              <Placeholder id={`player-${data.id}-card-2`} /> */}
            </div>
            <div className={style.score}>00.00%</div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
