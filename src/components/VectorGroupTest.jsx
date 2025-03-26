import React, { useEffect, useState } from "react";
import "../css/vector-group-test.css";
import NextPreviousButton from "./common/NextPreviousButton";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import VectorDiagram from "./common/VectorDiagram";

export default function VectorGroupTest() {
	const params = useParams();
    const [isSaving, setIsSaving] = useState(false);
	const dispatch = useDispatch();

    const OnSaveClick = (e) => {

	};


	useEffect(() => {
	  dispatch(setReportId(params.reportId));
	}, [])
	
    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [
        `/measurement-of-winding-resistance/${params.reportId}`,
        `/measurement-of-no-load-loss-and-no-load-current/${params.reportId}`,
    ];

    return (
        <div className="main-content vector-group">
			<ToastContainer />
			<div className="main-content-head">
				Vector Group Test
			</div>
            <div className="head-info">
                <VectorDiagram />
            </div>
            <NextPreviousButton
                isSaving={isSaving}
                OnSaveClick={OnSaveClick}
                State={NextPreviousButtonState}
                NextPrevLink={NextPrevLink}
            />
        </div>
    );
}
