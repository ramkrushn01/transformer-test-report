import React from 'react';
import "../../css/common/loading.css";
import PropTypes from "prop-types";

export default function Loading({size, color}) {
  return (
      <div className="main-loading">
          <div className="loader-container">
              <div className="loader" style={{width:size, height:size, borderTopColor: color}}></div>
          </div>
      </div>
  );
}



Loading.defaultProps = {
    size: "50px",
    color: "#3498db"
}

Loading.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
};

