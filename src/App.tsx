import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";

const Home = () => <div>Home</div>;
const Dash = () => (
  <div>
    <Link to="/news">Netflix</Link>
    Dash
  </div>
);
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Dash} />
          <Route path="/news" component={Home} />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
