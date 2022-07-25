import { add } from "./api/count";

import "./index.css";

const init = async () => {
  document.getElementById("app")!.innerHTML = `
  <h1>Hello Vanilla!</h1>
  `;
  console.log(await add(1, 2));
};

init();
