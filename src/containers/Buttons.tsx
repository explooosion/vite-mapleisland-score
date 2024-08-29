import { memo, useCallback, useState } from "react";
import {
  faSpinner,
  faPaperPlane,
  faSync,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { googleLogout } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import useHooks from "../hooks";
import { isSignedInState } from "../state";
import { usePlayService } from "../services/usePlayService";

const Buttons = memo(function Buttons() {
  const { fetchGetPlayDatesAndPlayersAndSheetNames, fetchPutScoreByName } =
    usePlayService();

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const setIsSignedInState = useSetRecoilState(isSignedInState);

  const { parsedUsers, parseUsersPayload } = useHooks();

  const handleLogout = () => {
    googleLogout();
    gapi.auth2.getAuthInstance().signOut();
    setIsSignedInState(false);
  };

  const handleBatchUpdateScore = useCallback(async () => {
    try {
      if (parsedUsers) {
        setIsLoadingSubmit(true);
        await fetchPutScoreByName(parseUsersPayload);
      }
    } catch (error: any) {
      toast.error(error?.result?.error?.message ?? error.message);
    } finally {
      setIsLoadingSubmit(false);
    }
  }, [fetchPutScoreByName, parseUsersPayload, parsedUsers]);

  const fetchGetBoth = useCallback(async () => {
    try {
      await fetchGetPlayDatesAndPlayersAndSheetNames();
      toast.success("資料已重取");
    } catch (error: any) {
      toast.error(error?.result?.error?.message ?? error.message);
    }
  }, [fetchGetPlayDatesAndPlayersAndSheetNames]);

  return (
    <div className="top-2 w-full md:w-auto flex flex-col sm:flex-row justify-center md:justify-end items-center my-2 md:my-0 space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4">
      <button
        className={`bg-green-500 hover:bg-green-600 text-white font-bold w-full sm:w-1/3 md:w-auto py-2 px-4 rounded flex items-center ${
          isLoadingSubmit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleBatchUpdateScore}
        disabled={isLoadingSubmit}
      >
        {isLoadingSubmit ? (
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        ) : (
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
        )}
        更新分數
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full sm:w-1/3 md:w-auto py-2 px-4 rounded flex items-center"
        onClick={fetchGetBoth}
      >
        <FontAwesomeIcon icon={faSync} className="mr-2" />
        重取資料
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold w-full sm:w-1/3 md:w-auto py-2 px-4 rounded flex items-center"
        onClick={handleLogout}
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        登出
      </button>
    </div>
  );
});

export default Buttons;
