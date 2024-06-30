import { useCallback } from "react";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";

import {
  IPlayDate,
  sheetNameState,
  playDatesState,
  playDateState,
  playersState,
} from "../state";

export interface IUpdate {
  name: string;
  columnIndex: number;
  newValue: number;
}

export const usePlayService = () => {
  const setPlayDates = useSetRecoilState(playDatesState);
  const setPlayDate = useSetRecoilState(playDateState);

  const sheetName = useRecoilValue(sheetNameState);

  const [players, setPlayers] = useRecoilState(playersState);

  const fetchGetPlayDatesAndPlayers = useCallback(async () => {
    const playDatesRange = `${sheetName}!A1:1`;
    const playersRange = `${sheetName}!C:C`;

    const response = await gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
      ranges: [playDatesRange, playersRange],
    });

    const batchData = response.result.valueRanges!;

    if (batchData.length === 2) {
      const playDatesData = batchData[0].values;
      const playersData = batchData[1].values;

      if (
        Array.isArray(playDatesData) &&
        playDatesData.length > 0 &&
        Array.isArray(playDatesData[0])
      ) {
        const newPlayDates: IPlayDate[] = playDatesData[0]
          .map((d, i) => ({ id: i, label: d }))
          .filter((_, i) => i > 7)
          .reverse();

        setPlayDates(newPlayDates);
        setPlayDate(newPlayDates[0].id);
      } else {
        throw new Error("找不到任何副本日期");
      }

      if (playersData && playersData.length > 0) {
        setPlayers(playersData.flatMap((row) => row));
      } else {
        throw new Error("找不到任何玩家名稱");
      }

      return batchData;
    } else {
      throw new Error("找不到任何資料");
    }
  }, [setPlayDates, setPlayDate, setPlayers, sheetName]);

  const fetchPutScoreByName = useCallback(
    async (updates: IUpdate[]) => {
      const nameColumn = "C";

      if (players && players.length > 0) {
        const requests: { range: string; values: number[][] }[] = [];

        updates.forEach(({ name, columnIndex, newValue }) => {
          const rowIndex = players.findIndex((p) => p === name);

          if (rowIndex !== -1) {
            const targetRange = `${sheetName}!R${rowIndex + 1}C${
              columnIndex + 1
            }`;
            requests.push({
              range: targetRange,
              values: [[newValue]],
            });
          } else {
            throw new Error(`找不到玩家名稱 "${name}" 在 ${nameColumn} 欄位。`);
          }
        });

        if (requests.length > 0) {
          const batchUpdateRequest = {
            data: requests,
            valueInputOption: "RAW",
          };

          const res = await gapi.client.sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
            resource: batchUpdateRequest,
          });

          toast.success("分數已更新");

          return res;
        } else {
          throw new Error("找不到任何更新要求");
        }
      } else {
        throw new Error("找不到任何玩家名稱");
      }
    },
    [players, sheetName]
  );

  return { fetchGetPlayDatesAndPlayers, fetchPutScoreByName };
};
