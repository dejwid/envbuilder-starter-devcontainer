import { useEffect, useState } from "react";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/test`).then((res) => {
      res.text().then((text) => {
        setMessage(text);
      });
    });
  }, []);
  return (
    <div className="test-red-500">
      {import.meta.env.VITE_API_URL}
      <br />
      message: {message}
    </div>
  );
}
