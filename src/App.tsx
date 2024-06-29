import { useCallback, useEffect, useState } from "react";
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

  // @ts-expect-error handleLoginSuccess is not used
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

  const checkScopes = useCallback(() => {
    const authInstance = gapi.auth2.getAuthInstance();
    const currentUser = authInstance.currentUser.get();
    const scopes = currentUser.getGrantedScopes();
    const requiredScopes = [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ];

    const hasAllScopes = requiredScopes.every((scope) =>
      scopes.includes(scope)
    );
    if (!hasAllScopes) {
      authInstance.signIn({ scope: requiredScopes.join(" ") });
    }
  }, []);

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init(clientConfig);
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        handleLoginSuccess(authInstance.currentUser.get());
      }
      checkScopes();
    };
    gapi.load("client:auth2", initClient);
  }, [checkScopes]);

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
