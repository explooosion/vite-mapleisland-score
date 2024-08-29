import { ChangeEvent, memo, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";

import {
  sheetNameState,
  sheetNamesState,
  playDatesState,
  playDateState,
  scoreState,
  scores,
  playerNameColumns,
  playerNameColumnState,
} from "../state";
import { usePlayService } from "../services/usePlayService";

const Selection = memo(function Selection() {
  const { fetchGetPlayDatesAndPlayers } = usePlayService();

  const playDates = useRecoilValue(playDatesState);

  const [sheetName, setSheetNameState] = useRecoilState(sheetNameState);
  const [playDate, setPlayDate] = useRecoilState(playDateState);
  const [score, setScore] = useRecoilState(scoreState);
  const [playerNameColumn, setPlayerNameColumn] = useRecoilState(
    playerNameColumnState
  );
  const sheetNames = useRecoilValue(sheetNamesState);

  const handlePlayDateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPlayDate(Number(event.target.value));

    const selectedPlayDate = playDates.find(
      (d) => d.id === Number(event.target.value)
    );
    if (selectedPlayDate) {
      toast.info(`你選擇了「${selectedPlayDate.label}」！`);
    }
  };

  const handleScoreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setScore(Number(event.target.value));
    toast.info(`你選擇了「${Number(event.target.value)}」！`);
  };

  const handleSheetNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSheetNameState(event.target.value);
    toast.info(`你選擇了「${event.target.value}」！`);
  };

  const handlePlayerNameColumnChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setPlayerNameColumn(event.target.value);
    toast.info(`你選擇了「${event.target.value}」！`);
  };

  useEffect(() => {
    async function fetchGetBoth() {
      try {
        await fetchGetPlayDatesAndPlayers();
        toast.success("資料已重取");
      } catch (error: any) {
        toast.error(error?.result?.error?.message ?? error.message);
      }
    }
    fetchGetBoth();
  }, [sheetName, fetchGetPlayDatesAndPlayers]);

  return (
    <div className="flex flex-col sm:flex-row items-end sm:space-x-4 space-y-2 sm:space-y-0">
      <div className="w-full md:w-auto flex flex-col">
        <label htmlFor="sheetName" className="text-gray-700 font-bold mb-2">
          表單名稱
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="sheetName"
          value={sheetName}
          onChange={handleSheetNameChange}
        >
          {sheetNames.map((s) => (
            <option key={s} value={s} label={s} />
          ))}
        </select>
      </div>
      <div className="w-full md:w-auto flex flex-col">
        <label htmlFor="playDates" className="text-gray-700 font-bold mb-2">
          副本日期 (A列)
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="playDates"
          value={playDate}
          onChange={handlePlayDateChange}
        >
          {playDates.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full md:w-auto flex flex-col">
        <label htmlFor="score" className="text-gray-700 font-bold mb-2">
          獲得分數
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="score"
          value={score}
          onChange={handleScoreChange}
        >
          {scores.map((s) => (
            <option key={s} value={s} label={s.toString()} />
          ))}
        </select>
      </div>
      <div className="w-full md:w-auto flex flex-col">
        <label
          htmlFor="playerNameColumn"
          className="text-gray-700 font-bold mb-2"
        >
          玩家名稱欄位
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="playerNameColumn"
          value={playerNameColumn}
          onChange={handlePlayerNameColumnChange}
        >
          {playerNameColumns.map((s) => (
            <option key={s} value={s} label={`${s} 欄`} />
          ))}
        </select>
      </div>
    </div>
  );
});

export default Selection;
