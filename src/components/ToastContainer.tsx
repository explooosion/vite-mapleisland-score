import { memo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MemoizedToastContainer = memo(function MemoizedToastContainer() {
  return (
    <ToastContainer pauseOnHover autoClose={2000} position="bottom-right" />
  );
});

export default MemoizedToastContainer;
