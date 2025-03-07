import React from 'react';
import "../../css/common/next-prev-btn.css";
import { Link } from 'react-router-dom';
import Loading from './Loading';

export default function NextPreviousButton(props) {
  return (
    <div className="main-next-prev-btn">
        <Link to={props.NextPrevLink[0]} className={`prev-btn ${Boolean(props.State[0]) && "btn-disable"}`}> ← Previous </Link>
        <button onClick={(e)=>{props?.OnSaveClick(e)}} className="save-btn">{props?.isSaving?<Loading size="10px" color="#6bf072"/>:"Save"} </button>
        <Link to={props.NextPrevLink[1]} className={`next-btn ${Boolean(props.State[1]) && "btn-disable"}`}> Next → </Link>
    </div>
  )
}
