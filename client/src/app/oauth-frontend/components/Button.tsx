"use client";
import { ReactElement } from "react";

interface ButtonProps {
  buttonText: string;
  handleClick: () => void;
  buttonColor: string;
  disabled?: boolean;
}

export default function Button({
  buttonText,
  handleClick,
  buttonColor,
  disabled,
}: ButtonProps): ReactElement {
  const styles: string = `${buttonColor} p-3 m-[5%] text-white font-bold text-xl text-center hover:bg-orange-300 border border-white`;

  return (
    <button
      className={styles}
      onClick={handleClick}
      disabled={disabled || false}
    >
      {buttonText}
    </button>
  );
}
