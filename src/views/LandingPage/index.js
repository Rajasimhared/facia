import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default class LandingPage extends Component {
  render() {
    return (
      <div className="landing-page">
        <p>Facia is about recognising human faces</p>
        <div className="app-options">
          <Link to="/photo" className="option">
            <div>Photo Input</div>
          </Link>
          <Link to="/camera" className="option">
            <div>Video Camera</div>
          </Link>
        </div>
      </div>
    );
  }
}
