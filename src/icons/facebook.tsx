import React from "react";

type Props = {
  className?: string;
};

function FacebookIcon({ className }: Props) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="#1877F2"
        d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
      />
      <path
        fill="#FFFFFF"
        d="M26.707 29.301h5.176l.813-5.258h-5.989v-2.874c0-2.184.714-4.121 2.757-4.121h3.283V12.46c-.577-.078-1.797-.248-4.102-.248-4.814 0-7.636 2.542-7.636 8.334v3.498H16.06v5.258h4.948v13.878c.98.145 1.973.24 2.992.24.921 0 1.82-.084 2.707-.213V29.301z"
      />
    </svg>
  );
}

export default FacebookIcon;
