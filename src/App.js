import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LINES from "./data.js";

const useStyles = makeStyles((theme) => ({}));

export default function App() {
  const classes = useStyles();
  const [currIndex, setCurrIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const greenRef = useRef("");
  const blackRef = useRef();

  const filterString = (string) => string.split("").slice(0).join("");

  function handleChange(lastChar) {
    if (lastChar === blackRef.current.innerText[0] && lastChar !== " ") {
      greenRef.current.innerText =
        greenRef.current.innerText + blackRef.current.innerText[0];
      blackRef.current.innerText = blackRef.current.innerText.substring(1);
      return;
    }
    if (lastChar === " " && blackRef.current.innerText[0] === " ") {
      greenRef.current.innerText = greenRef.current.innerText + " ";
      blackRef.current.innerText = filterString(blackRef.current.innerText);
      return;
    }

    if (greenRef.current.innerText === LINES[currIndex]) {
      blackRef.current.innerText = LINES[currIndex + 1];
      greenRef.current.innerText = "";
      setCurrIndex(() => currIndex + 1);
      setSeconds(() => 0);
      setWpm(() => 0);

      return;
    }
  }
  useEffect(() => {
    if (!mounted) {
      blackRef.current.innerText = LINES[currIndex];
      setMounted(true);
    }

    window.addEventListener("keydown", (event) => handleChange(event.key));
    return window.removeEventListener("keydown", (event) =>
      handleChange(event.key)
    );
  }, []);

  useEffect(() => {
    const timeout = () =>
      setTimeout(() => {
        setSeconds(() => seconds + 1);
      }, 1000);
    timeout();
    const words = greenRef.current.innerText;
    const wordsCompleted = words.split(" ").length;

    if (wordsCompleted > 0 && words !== "") {
      const minutes = seconds / 60;
      setWpm(() => Math.floor(wordsCompleted / minutes));
    }

    return () => clearTimeout(timeout);
  }, [seconds, wpm]);

  return (
    <div>
      <div>
        <span ref={greenRef} style={{ color: "green" }}></span>
        <span ref={blackRef}></span>
      </div>

      <h3>WPM: {wpm}</h3>
    </div>
  );
}
