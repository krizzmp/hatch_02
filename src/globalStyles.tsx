import { injectGlobal } from "emotion";
injectGlobal`
  * {
    box-sizing: border-box;
  }
  body{
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
  body {
  overscroll-behavior: none;
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
.fade-enter {
  opacity: 0.01;
}
.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 500ms ease-in;
}
.fade-leave {
  opacity: 1;
}
.fade-leave.fade-leave-active {
  opacity: 0.01;
  
  transition: opacity 300ms ease-in;
}
`;
