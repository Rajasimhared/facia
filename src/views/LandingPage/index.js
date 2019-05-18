import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LandingPage extends Component {
  render() {
    return (
      <div>
        <h2>Facia</h2>
        <li>
          <Link to="/photo">Photo Input</Link>
        </li>
        <li>
          <Link to="/camera">Video Camera</Link>
        </li>
      </div>
    );
  }
}
