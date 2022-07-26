import count from "@api/count";

import "./index.css";

const init = async () => {
  document.getElementById("app")!.innerHTML = `
  <h1>Hello Vanilla!</h1>
  <button id="add">add</button>
  `;
  document.getElementById("add")!.onclick = async () => {
    console.log(await count(1, 2));
  };
};

init();
