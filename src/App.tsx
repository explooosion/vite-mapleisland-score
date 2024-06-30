import { useCallback, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

import { isSignedInState } from "./state";
import Toastify from "./components/ToastContainer";
import Content from "./containers/Content";

const clientConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  clientId: import.meta.env.VITE_CLIENT_ID,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope:
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
};

function App() {
  const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);

  const handleLoginSuccess = useCallback(
    (response?: any) => {
      const authInstance = gapi.auth2.getAuthInstance();
      if (
        (authInstance.isSignedIn.get() || response) &&
        !isSignedIn &&
        gapi.client &&
        gapi.client.sheets
      ) {
        setIsSignedIn(true);
      }
    },
    [isSignedIn, setIsSignedIn]
  );

  const handleLoginFailure = () => {
    toast.error("登入失敗");
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
      scopes?.includes(scope)
    );

    if (!hasAllScopes) {
      authInstance.signIn({ scope: requiredScopes.join(" ") });
    }
  }, []);

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init(clientConfig);
      handleLoginSuccess();
      checkScopes();
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
        <Content />
      )}
      <Toastify />
    </GoogleOAuthProvider>
  );
}

export default App;
