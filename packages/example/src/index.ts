import count from "@api/count";

import "./index.css";

const init = async () => {
  document.getElementById("app")!.innerHTML = `
  <h1>Hello Vanilla!</h1>
  <button id="count">Async Call Cloud Function(count)</button>
  <p id="result">Current Result: 0</p>
  `;
  let currentCount = 0;

  const refreshUI = () => {
    document.getElementById(
      "result"
    )!.innerText = `Current Result: ${currentCount}`;
  };

  const addEventListener = () => {
    document.getElementById("count")!.onclick = async () => {
      currentCount = await count(currentCount, 1);
      refreshUI();
    };
  };

  addEventListener();
  refreshUI();
};

init();
