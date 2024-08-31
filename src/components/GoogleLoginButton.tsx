interface GoogleLoginButtonProps {
  onClick: () => void;
}

function GoogleLoginButton({ onClick }: GoogleLoginButtonProps) {
  return (
    <button
      className="flex items-center justify-center bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md px-4 py-2 space-x-2"
      onClick={onClick}
    >
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#4285F4"
          d="M46.8 24.3c0-1.5-.1-3-.3-4.5H24v8.5h12.9c-.6 3-2.5 5.5-5.3 7.1v5.9h8.6c5-4.6 7.6-11.5 7.6-19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-8.6-6.8c-2.4 1.6-5.5 2.5-8.9 2.5-6.9 0-12.7-4.7-14.8-11.1H2.4v7l8.7 6.7c2.5 1.2 5.4 1.9 8.9 1.9z"
        />
        <path
          fill="#FBBC05"
          d="M9.2 28.9C8.6 27.3 8.3 25.6 8.3 24c0-1.6.3-3.3.9-4.9V12h-8.7c-1.7 3.5-2.7 7.5-2.7 12s1 8.5 2.7 12l8.6-6.7z"
        />
        <path
          fill="#EA4335"
          d="M24 9.5c3.7 0 7 .9 9.5 2.7l7-7c-4.4-3.2-9.9-5.2-16.5-5.2C14.8 0 7.6 4.2 2.8 10.3l8.7 6.7C14.6 12 19 9.5 24 9.5z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>使用 Google 登入</span>
    </button>
  );
}

export default GoogleLoginButton;
