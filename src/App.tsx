import { useEffect, useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";

import MemoizedToastContainer from "./components/ToastContainer";
import Content from "./containers/Content";

const clientConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  clientId: import.meta.env.VITE_CLIENT_ID,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope:
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleLoginSuccess = (response: any) => {
    setIsSignedIn(true);
  };

  const handleLoginFailure = () => {
    toast.error("登入失敗");
    console.log("handleLoginFailure");
  };

  const handleLogout = () => {
    // Perform Google logout
    googleLogout();
    // gapi.auth.signOut();
    // Set isSignedIn to false to update the UI
    setIsSignedIn(false);
  };

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init(clientConfig);

      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance && authInstance.isSignedIn.get()) {
        const user = authInstance.currentUser.get();
        handleLoginSuccess(user);
      }
    };
    gapi.load("client:auth2", initClient);
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      {!isSignedIn ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <GoogleLogin
            size="large"
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
      ) : (
        <>
          <Content logout={handleLogout} />
          <MemoizedToastContainer />
        </>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
