import React, { Component } from "react";
import { Route, Router } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import "./App.css";

import LandingPage from "./views/LandingPage";
import ImageInput from "./views/ImageInput";
import VideoInput from "./views/VideoInput";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="heading">Facia</div>
        <Router history={createHistory()}>
          <div className="route">
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/photo" component={ImageInput} />
            <Route exact path="/camera" component={VideoInput} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
