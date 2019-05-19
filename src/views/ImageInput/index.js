import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  loadModels,
  getFullFaceDescription,
  createMatcher
} from "../../api/face";
import DrawBox from "../../components/DrawBox";
import testImg from "../../img/rajasimha.jpg";

// Import face profile
import JSON_PROFILE from "../../desriptors/data.json";

// Initial State
const INIT_STATE = {
  imageURL: testImg,
  fullDesc: null,
  detections: null,
  descriptors: null,
  match: null,
  expression: null
};

class ImageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE, faceMatcher: null };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    await this.handleImage(this.state.imageURL);
  };

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      if (!!fullDesc) {
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
        this.setState({
          fullDesc,
          detections: fullDesc.map(fd => fd.detection),
          descriptors: fullDesc.map(fd => fd.descriptor),
          expressions: fullDesc.map(fd => fd.expressions)
        });
      }
    });

    if (!!this.state.descriptors && !!this.state.faceMatcher) {
      let match = await this.state.descriptors.map(descriptor =>
        this.state.faceMatcher.findBestMatch(descriptor)
      );
      this.setState({ match });
    }
  };

  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImage();
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };

  render() {
    const {
      imageURL,
      detections,
      match,
      expressions,
      expression,
      value
    } = this.state;
    return (
      <div>
        <input
          id="myFileUpload"
          type="file"
          onChange={this.handleFileChange}
          accept=".jpg, .jpeg, .png"
        />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute" }}>
            <img src={imageURL} alt="imageURL" id="default-face" />
          </div>
          <DrawBox
            expression={expression}
            value={value}
            detections={detections}
            match={match}
            expressions={expressions}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ImageInput);
