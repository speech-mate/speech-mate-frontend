import React from "react";
import propTypes from "prop-types";

function Review({ audio }) {
  return (
    <div>
      <audio controls src={audio} />
    </div>
  );
}

Review.propTypes = {
  audio: propTypes.string,
};

export default Review;
