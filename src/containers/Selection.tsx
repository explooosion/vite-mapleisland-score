import { ChangeEvent, memo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  sheetNameState,
  sheetNames,
  playDatesState,
  playDateState,
  scoreState,
  scores,
  ISheetName,
} from "../state";

const Selection = memo(function Selection() {
  const playDates = useRecoilValue(playDatesState);

  const [sheetName, setSheetNameState] = useRecoilState(sheetNameState);
  const [playDate, setPlayDate] = useRecoilState(playDateState);
  const [score, setScore] = useRecoilState(scoreState);

  const handlePlayDateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPlayDate(Number(event.target.value));
  };

  const handleScoreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setScore(Number(event.target.value));
  };

  const handleSheetNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSheetNameState(event.target.value as ISheetName);
  };

  return (
    <div className="flex flex-col sm:flex-row items-end sm:space-x-4 space-y-2 sm:space-y-0">
      <div className="w-full md:w-auto flex flex-col">
        <label htmlFor="scores" className="text-gray-700 font-bold mb-2">
          表單名稱
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="scores"
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
          副本日期
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
        <label htmlFor="scores" className="text-gray-700 font-bold mb-2">
          獲得分數
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="scores"
          value={score}
          onChange={handleScoreChange}
        >
          {scores.map((s) => (
            <option key={s} value={s} label={s.toString()} />
          ))}
        </select>
      </div>
    </div>
  );
});

export default Selection;
