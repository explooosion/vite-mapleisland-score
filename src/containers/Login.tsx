import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import { isSignedInState } from "../state";
import GoogleLoginButton from "../components/GoogleLoginButton";

const ACCESS_TOKEN = "access_token";

const clientConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  clientId: import.meta.env.VITE_CLIENT_ID,
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope:
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
};

function Login() {
  const [loaded, setLoaded] = useState(false);

  const setIsSignedIn = useSetRecoilState(isSignedInState);

  const initialGAPI = (access_token: string) => {
    gapi.load("client", () => {
      gapi.client.init(clientConfig).then(() => {
        gapi.client.setToken({ access_token });
        localStorage.setItem(ACCESS_TOKEN, access_token);
        setIsSignedIn(true);
      });
    });
  };

  const handleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("handleLogin.onSuccess", tokenResponse);
      initialGAPI(tokenResponse.access_token);
    },
    onError: (error) => {
      setIsSignedIn(false);
      console.error("handleLogin.onError", error);
      toast.error(error.error);
      localStorage.clear();
    },
    scope: clientConfig.scope,
  });

  useEffect(function autoLogin() {
    async function validateToken(access_token: string) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`
        );
        const data = await response.json();
        return data.aud === clientConfig.clientId;
      } catch (error) {
        console.error("validateToken.catch", error);
        return false;
      }
    }

    const access_token = localStorage.getItem(ACCESS_TOKEN);

    if (access_token) {
      validateToken(access_token).then((isValid) => {
        if (isValid) {
          initialGAPI(access_token);
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
          toast.warn("登入已過期，請重新登入。");
          setLoaded(true);
        }
      });
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loaded ? (
        <GoogleLoginButton onClick={handleLogin} />
      ) : (
        <div className="text-gray-500 text-lg animate-pulse">Loading...</div>
      )}
    </div>
  );
}

export default Login;
