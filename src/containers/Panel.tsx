import { ChangeEvent, memo } from "react";
import { useRecoilState } from "recoil";

import useHooks from "../hooks";
import { targetPlayersState } from "../state";

const Panel = memo(function Panel() {
  const [targetPlayers, setTargetPlayers] =
    useRecoilState<string>(targetPlayersState);

  const {
    parsedUsers,
    findNotMatchTargetPlayersInPlayers,
    findNotMatchMessage,
    findDiffPlayer,
  } = useHooks();

  const handleTargetUsersChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTargetPlayers(value);
  };

  return (
    <section className="w-full flex flex-col-reverse md:flex-row justify-between md:space-x-5">
      <div className="w-full pt-5 md:pt-0">
        <div className="mb-2 text-gray-700">
          請輸入玩家名稱 (C欄)，接著用逗號（,）或換行分隔。
        </div>
        <textarea
          className="w-full h-full md:max-h-[500px] border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 md:overflow-y-auto"
          autoFocus
          rows={window.innerWidth > 768 ? 20 : 5}
          value={targetPlayers}
          onChange={handleTargetUsersChange}
        />
      </div>
      <div className="w-full md:pt-7 space-y-2">
        <div className="text-gray-700">
          共偵測到 {parsedUsers.length} 筆玩家資料
        </div>
        <hr />
        <div className="text-blue-700">共有 {findDiffPlayer} 位玩家匹配到</div>
        <div className="text-red-700">
          共有 {findNotMatchTargetPlayersInPlayers.length} 位玩家沒匹配到
        </div>
        {findNotMatchTargetPlayersInPlayers.length > 0 && (
          <>
            <div className="text-red-700">異常名單：{findNotMatchMessage}</div>
          </>
        )}
      </div>
    </section>
  );
});

export default Panel;
