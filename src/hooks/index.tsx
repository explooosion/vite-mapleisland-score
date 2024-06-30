import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import {
  playersState,
  targetPlayersState,
  playDateState,
  scoreState,
} from "../state";
import { IUpdate } from "../services/usePlayService";

const useHooks = () => {
  const players = useRecoilValue(playersState);
  const targetPlayers = useRecoilValue(targetPlayersState);
  const playDate = useRecoilValue(playDateState);
  const score = useRecoilValue(scoreState);

  const parsedUsers = useMemo(() => {
    return targetPlayers
      .split(/[\n,]+/)
      .map((user) => user.trim())
      .filter((user) => user);
  }, [targetPlayers]);

  const parseUsersPayload = useMemo<IUpdate[]>(() => {
    return parsedUsers.map((user) => ({
      name: user,
      columnIndex: playDate,
      newValue: score,
    }));
  }, [parsedUsers, playDate, score]);

  const findNotMatchTargetPlayersInPlayers = useMemo(() => {
    return parsedUsers.filter((user) => !players.includes(user));
  }, [parsedUsers, players]);

  const findNotMatchMessage = useMemo(() => {
    return findNotMatchTargetPlayersInPlayers.join(", ");
  }, [findNotMatchTargetPlayersInPlayers]);

  const findDiffPlayer = useMemo(() => {
    return parsedUsers.length - findNotMatchTargetPlayersInPlayers.length;
  }, [parsedUsers, findNotMatchTargetPlayersInPlayers]);

  return {
    parsedUsers,
    parseUsersPayload,
    findNotMatchTargetPlayersInPlayers,
    findNotMatchMessage,
    findDiffPlayer,
  };
};

export default useHooks;
