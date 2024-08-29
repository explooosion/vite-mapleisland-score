import { useEffect, memo } from "react";

import { usePlayService } from "../services/usePlayService";
import Header from "./Header";
import Buttons from "./Buttons";
import Selection from "./Selection";
import Panel from "./Panel";

const Content = memo(function Content() {
  const { fetchGetPlayDatesAndPlayersAndSheetNames } = usePlayService();

  useEffect(() => {
    fetchGetPlayDatesAndPlayersAndSheetNames();
  }, []);

  return (
    <main className="p-4 md:p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white p-4 md:p-4 rounded-lg shadow-md">
        <header className="mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <Header />
            <Buttons />
          </div>
          <Selection />
        </header>

        <Panel />
      </div>
    </main>
  );
});

export default Content;
