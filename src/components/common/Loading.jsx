import React from 'react';
import "../../css/common/loading.css";
import PropTypes from "prop-types";

export default function Loading({size}) {
  return (
      <div className="main-loading">
          <div className="loader-container">
              <div className="loader" style={{width:size, height:size}}></div>
          </div>
      </div>
  );
}



Loading.defaultProps = {
    size: "50px",
}

Loading.propTypes = {
    size: PropTypes.string,
    // color: PropTypes.string,
};

