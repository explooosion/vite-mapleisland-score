import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRecoilValue } from "recoil";

import { isSignedInState } from "./state";
import Toastify from "./components/ToastContainer";
import Content from "./containers/Content";
import Login from "./containers/Login";

function App() {
  const isSignedIn = useRecoilValue(isSignedInState);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      {!isSignedIn ? <Login /> : <Content />}
      <Toastify />
    </GoogleOAuthProvider>
  );
}

export default App;
