import { memo } from "react";
import {
  faSpinner,
  faPaperPlane,
  faSync,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IButtonsProps {
  handleBatchUpdateScore: () => void;
  isLoadingSubmit: boolean;
  fetchGetBoth: (isForce?: boolean) => void;
  logout: () => void;
}

const MemoizedButtons = memo<IButtonsProps>(function MemoizedButtons(props) {
  const { handleBatchUpdateScore, isLoadingSubmit, fetchGetBoth, logout } =
    props;
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
        onClick={() => fetchGetBoth(true)}
      >
        <FontAwesomeIcon icon={faSync} className="mr-2" />
        重取資料
      </button>
      {false && (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold w-full sm:w-1/3 md:w-auto py-2 px-4 rounded flex items-center"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          登出
        </button>
      )}
    </div>
  );
});

export default MemoizedButtons;
