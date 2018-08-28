import { injectGlobal } from "emotion";
injectGlobal`
  * {
    box-sizing: border-box;
  }
  body{
    margin: 0;
    padding: 0;
  }
  body {
  margin: 0;
  padding: 0;
  font-family: Menlo, Monaco, Consolas, "Lucida Console", monospace;

}
#root{
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
div[tabindex="-1"]:focus {
  outline: 0;
}
`;
