import { memo } from "react";

const Header = memo(function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        毛茸秘境 - 炎團分數登記
      </h1>
      <a
        href="https://docs.google.com/spreadsheets/d/1aKLQuvdW7YnA3detaVAZig0OO3RRU3gnsXAT__sd0JE/edit?gid=0#gid=0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        查看試算表
      </a>
    </div>
  );
});

export default Header;
