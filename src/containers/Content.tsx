import {
  ChangeEvent,
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { gapi } from "gapi-script";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import MemoizedHeader from "./Header";
import MemoizedButtons from "./Buttons";

interface IPlayDate {
  id: number;
  label: string;
}

const MemoizedContent = memo(function Content(props: { logout: () => void }) {
  const { logout } = props;

  const [playDates, setPlayDates] = useState<IPlayDate[]>([]);
  const [playDate, setPlayDate] = useState<number>(0);
  const [players, setPlayers] = useState<string[]>([]);

  const [targetPlayers, setTargetPlayers] = useState<string>("");

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [score, setScore] = useState<number>(1);
  const scores = [1, 0.8, 0.5, 0.3, 0];

  const fetchGetPlayDates = useCallback(async (showMessage?: boolean) => {
    try {
      const range = "自動化測試!A1:1";

      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
        range: range,
      });

      const data = response.result.values;
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        const newData = data[0]
          .map((d, i) => ({ id: i, label: d }))
          .filter((_, i) => i > 7)
          .reverse();

        setPlayDates(newData);
        setPlayDate(newData[0].id);

        showMessage && toast.success("副本日期已重取");
      }
    } catch (error: any) {
      toast.error(error.result.error.message, {
        toastId: "fetchGetPlayDates",
        delay: 5000,
      });
      console.error("fetchGetPlayDates", error);
    }
  }, []);

  const fetchGetPlayers = useCallback(async (showMessage?: boolean) => {
    const sheetName = "自動化測試";
    const nameColumn = "C";
    const range = `${sheetName}!${nameColumn}:${nameColumn}`;

    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
        range: range,
      });
      const data = response.result.values;
      if (data && data.length > 0) {
        setPlayers(data.flatMap((row) => row));
        showMessage && toast.success("玩家名稱已重取");
      }
    } catch (error: any) {
      toast.error(error.message, {
        toastId: "fetchGetPlayers",
        delay: 5000,
      });
    }
  }, []);

  const fetchGetBoth = useCallback(
    (showMessage?: boolean) => {
      return Promise.all([
        fetchGetPlayDates(showMessage),
        fetchGetPlayers(showMessage),
      ]);
    },
    [fetchGetPlayDates, fetchGetPlayers]
  );

  const fetchPutScoreByName = useCallback(
    async (
      updates: { name: string; columnIndex: number; newValue: number }[]
    ) => {
      const sheetName = "自動化測試";
      const nameColumn = "C";

      try {
        setIsLoadingSubmit(true);
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
              toast.warn(`找不到玩家名稱 "${name}" 在 ${nameColumn} 欄位。`, {
                delay: 5000,
              });
            }
          });

          if (requests.length > 0) {
            const batchUpdateRequest = {
              data: requests,
              valueInputOption: "RAW",
            };

            await gapi.client.sheets.spreadsheets.values.batchUpdate({
              spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
              resource: batchUpdateRequest,
            });

            toast.success("分數已更新");
          }
        } else {
          toast.warn("找不到任何玩家名稱", {
            toastId: "fetchPutScoreByName",
            delay: 5000,
          });
        }
      } catch (error: any) {
        toast.error(error.message, {
          toastId: "fetchPutScoreByName",
          delay: 5000,
        });
      } finally {
        setIsLoadingSubmit(false);
      }
    },
    [players]
  );

  const handlePlayDateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPlayDate(Number(event.target.value));
  };

  const handleScoreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setScore(Number(event.target.value));
  };

  const handleTargetUsersChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTargetPlayers(value);
  };

  const parsedUsers = useMemo(() => {
    return targetPlayers
      .split(/[\n,]+/)
      .map((user) => user.trim())
      .filter((user) => user);
  }, [targetPlayers]);

  const findNotMatchTargetPlayersInPlayers = useMemo(() => {
    return parsedUsers.filter((user) => !players.includes(user));
  }, [parsedUsers, players]);

  const findNotMatchMessage = useMemo(() => {
    return "(" + findNotMatchTargetPlayersInPlayers.join(", ") + ")";
  }, [findNotMatchTargetPlayersInPlayers]);

  const findDiffPlayer = useMemo(() => {
    return parsedUsers.length - findNotMatchTargetPlayersInPlayers.length;
  }, [parsedUsers, findNotMatchTargetPlayersInPlayers]);

  const handleBatchUpdateScore = useCallback(async () => {
    if (parsedUsers) {
      setIsLoadingSubmit(true);
      const updates = parsedUsers.map((user) => ({
        name: user,
        columnIndex: playDate,
        newValue: score,
      }));
      await fetchPutScoreByName(updates);
    }
  }, [fetchPutScoreByName, parsedUsers, playDate, score]);

  useEffect(() => {
    const initClient = async () => {
      if (gapi.client && gapi.client.sheets) {
        fetchGetBoth();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        initClient();
      }
    };

    initClient();
  }, [fetchGetBoth]);

  return (
    <main className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <header className="mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <MemoizedHeader />
            <MemoizedButtons
              {...{
                handleBatchUpdateScore,
                isLoadingSubmit,
                fetchGetBoth,
                logout,
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="w-full md:w-auto flex flex-col">
              <label
                htmlFor="playDates"
                className="text-gray-700 font-bold mb-2"
              >
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
                分數
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
        </header>

        <section>
          <div className="mb-2 text-gray-700">
            請輸入玩家名稱，用逗號（,）或換行來分隔。
          </div>
          <textarea
            className="w-full md:w-[60%] max-h-[400px] border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
            autoFocus
            rows={30}
            value={targetPlayers}
            onChange={handleTargetUsersChange}
          />
          <div className="mt-2 text-gray-700">
            共偵測到 {parsedUsers.length} 筆玩家資料
          </div>
          <div className="mt-2 text-blue-700">
            共偵測到 {findDiffPlayer} 位玩家匹配到
          </div>
          <div className="mt-2 text-red-700">
            共偵測到 {findNotMatchTargetPlayersInPlayers.length} 位玩家沒匹配到{" "}
            {findNotMatchTargetPlayersInPlayers.length
              ? findNotMatchMessage
              : ""}
          </div>
        </section>
      </div>
    </main>
  );
});

export default MemoizedContent;
