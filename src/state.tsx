import { atom } from "recoil";

export interface IPlayDate {
  id: number;
  label: string;
}

export const isSignedInState = atom<boolean>({
  key: "isSignedInState",
  default: false,
});

export const sheetNameState = atom<string>({
  key: "sheetNameState",
  default: "自動化測試",
});

//#region 副本日期資料
export const playDatesState = atom<IPlayDate[]>({
  key: "playDatesState",
  default: [],
});

export const playDateState = atom<number>({
  key: "playDateState",
  default: 0,
});
//#endregion

//#region 所有玩家資料
export const playersState = atom<string[]>({
  key: "playersState",
  default: [],
});
//#endregion

//#region 目標玩家資料
export const targetPlayersState = atom<string>({
  key: "targetPlayersState",
  default: "",
});
//#endregion

//#region 目標分數
export const scoreState = atom<number>({
  key: "scoreState",
  default: 1,
});
//#endregion

export const playerNameColumnState = atom<string>({
  key: "playerNameColumnState",
  default: "C",
});

export const scores = [1, 0.8, 0.5, 0.3, 0];

export const sheetNamesState = atom<string[]>({
  key: "sheetNames",
  default: ["自動化測試"],
});

export const playerNameColumns = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
];
