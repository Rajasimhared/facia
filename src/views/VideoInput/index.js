import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import {
  loadModels,
  getFullFaceDescription,
  createMatcher
} from "../../api/face";
import DrawBox from "../../components/DrawBox";
import Loader from "../../components/Loader";
// Import face profile
import JSON_PROFILE from "../../desriptors/data.json";
import "./style.css";

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      expressions: null,
      facingMode: null,
      loader: true
    };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user"
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" }
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1000);
  };

  showContent = () => {
    const { expression } = this.state;
    switch (expression) {
      case "neutral":
        return (
          <div className="neutral">
            <h2>Don't worry your life is awesome!</h2>
            <h2>Get some energy folks</h2>
            <h2>You are doing good.</h2>
          </div>
        );
      case "sad":
        return (
          <div className="sad">
            <h2>Life is all about ups & downs chill!!</h2>
            <h2>Don't lose hopes stand until the last stands!</h2>
          </div>
        );
      case "happy":
        return (
          <div className="happy">
            <h2>Keep this smile on your face!!</h2>
          </div>
        );
      case "surprised":
        return (
          <div className="surprised">
            <h2>Surprise is the greatest gift which life can grant us!</h2>
          </div>
        );
      case "fear":
        return (
          <div className="fear">
            <h2>He who has overcome his fears will truly be free.</h2>
          </div>
        );
      case "angry":
        return (
          <div className="angry">
            <h2>
              Reactions come from the mind, responses come from the heart.
            </h2>
          </div>
        );
    }
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        console.log(fullDesc);
        if (fullDesc.length !== 0) {
          let expression = fullDesc[0].expressions;
          let key,
            value = 0;
          Object.keys(expression).forEach(e => {
            if (expression[e] > value) {
              key = e;
              value = expression[e];
            }
          });
          this.setState({ expression: key, value });
        }
        if (!!fullDesc) {
          this.setState({
            expressions: fullDesc.map(fd => fd.expressions),
            detections: fullDesc.map(fd => fd.detection),
            descriptors: fullDesc.map(fd => fd.descriptor)
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        let match = await this.state.descriptors.map(descriptor =>
          this.state.faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
    }
  };

  render() {
    const {
      detections,
      match,
      facingMode,
      expressions,
      expression,
      value,
      loader
    } = this.state;
    let videoConstraints = null;
    let camera = "";
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === "user") {
        camera = "Front";
      } else {
        camera = "Back";
      }
    }

    return (
      <div className="video-input">
        {this.showContent()}
        <div className="camera">
          <p>Camera: {camera}</p>
          <div
            style={{
              width: WIDTH,
              height: HEIGHT
            }}
          >
            <div style={{ position: "relative", width: WIDTH }}>
              {!!videoConstraints ? (
                <div style={{ position: "absolute" }}>
                  <Webcam
                    audio={false}
                    width={WIDTH}
                    height={HEIGHT}
                    ref={this.webcam}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                </div>
              ) : null}
              <DrawBox
                expression={expression}
                value={value}
                detections={detections}
                match={match}
                expressions={expressions}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(VideoInput);
