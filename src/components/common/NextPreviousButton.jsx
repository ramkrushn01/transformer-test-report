import React from 'react';
import "../../css/common/next-prev-btn.css";
import { Link } from 'react-router-dom';

export default function NextPreviousButton(props) {
  return (
    <div className="main-next-prev-btn">
        <Link to={props.NextPrevLink[0]} className={`prev-btn ${Boolean(props.State[0]) && "btn-disable"}`}> ← Previous </Link>
        <Link to={props.NextPrevLink[1]} className={`next-btn ${Boolean(props.State[1]) && "btn-disable"}`}> Next → </Link>
    </div>
  )
}
