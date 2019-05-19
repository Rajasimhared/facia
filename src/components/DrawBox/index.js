import React from "react";

const DrawBox = ({ detections, match, expressions, expression, value }) => {
  let drawBox = null;
  if (!!detections) {
    drawBox = detections.map((detection, i) => {
      let _H = detection.box.height;
      let _W = detection.box.width;
      let _X = detection.box._x;
      let _Y = detection.box._y;
      return (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              border: "solid",
              borderColor: "green",
              height: _H,
              width: _W,
              transform: `translate(${_X}px,${_Y}px)`
            }}
          >
            {!!match && !!match[i] ? (
              <p
                style={{
                  backgroundColor: "green",
                  border: "solid",
                  borderColor: "green",
                  width: _W,
                  marginTop: 0,
                  color: "#fff",
                  transform: `translate(-3px,${_H}px)`
                }}
              >
                {match[i]._label}
                <br />
                {expression} : {value.toFixed(2)}
              </p>
            ) : null}
          </div>
        </div>
      );
    });
    return drawBox;
  } else {
    return <div />;
  }
};

export default DrawBox;
