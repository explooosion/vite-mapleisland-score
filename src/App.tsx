import { useEffect, useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { gapi } from "gapi-script";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<string[][]>([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: import.meta.env.VITE_API_KEY,
        clientId: import.meta.env.VITE_CLIENT_ID,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
        ],
        scope:
          "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const handleLoginSuccess = (response: any) => {
    console.log("handleLoginSuccess", response);
    setIsSignedIn(true);
  };

  const handleLoginFailure = () => {
    console.log("handleLoginFailure", "Login Failed");
  };

  const handleLogout = () => {
    googleLogout();
    setIsSignedIn(false);
  };

  const listData = async () => {
    const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
    const range = "自動化測試";

    // @ts-expect-error gapi is not defined
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const data = response.result.values;
    if (data.length > 0) {
      console.log("Header:", data[0]);
      console.log("Data:", data.slice(1));
      setSpreadsheetData(data);
    } else {
      console.log("listData", "No data found.");
    }
  };

  const appendData = async () => {
    const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
    const range = "自動化測試";
    const values = [["Sample Data 1", "Sample Data 2"]];

    // @ts-expect-error gapi is not defined
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: values,
      },
    });

    if (response.result.updates.updatedCells) {
      console.log(`${response.result.updates.updatedCells} cells appended.`);
      listData();
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <div>
        {!isSignedIn ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        ) : (
          <div>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={listData}>List Data</button>
            <button onClick={appendData}>Append Data</button>
            <div>
              {spreadsheetData.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      {spreadsheetData[0].map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {spreadsheetData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
