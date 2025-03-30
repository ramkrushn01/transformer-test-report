import React, { useEffect, useRef, useState } from "react";
import "../css/oil-bdv.css";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setReportId } from "../redux/features/reportIdSlice";
import NextPreviousButton from "./common/NextPreviousButton";
import API from "../api/custom_axios";

export default function OilBdv() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [oilBDV, setOilBDV] = useState();

    const OnOilBDVChange = (e)=>{
        setIsAnyDataChange(true);
        setOilBDV(e.target.value);
    }

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }

        setIsSaving(true);
        API.patch(`/oil-bdv/${idRef.current}/`, {
            oil_bdv: oilBDV,
        })
            .then((response) => {
                setIsSaving(false);
                toast.success("Success! Information updated successfully.");
                setIsAnyDataChange(false);
            })
            .catch((err) => {
                setIsSaving(false);
                toast.error(`Error! ${err}`);
            });
    };


    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(`/oil-bdv/by-customer/${params.reportId}/`)
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setOilBDV(resp_data.oil_bdv);
            })
            .catch((err) => {});
    }, []);

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [
        `/separate-source-voltage-withstand-test/${params.reportId}`,
        `/induced-over-voltage-test/${params.reportId}`,
    ];

    return (
        <div className="main-content oil-bdv">
            <ToastContainer />
            <div className="main-content-head">Oil BDV</div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label htmlFor="oil-bdv" className="main-label">OIL BDV</label>
                            </td>
                            <td>
                                <input type="number" className="main-input" id="oil-bdv" onChange={OnOilBDVChange} value={oilBDV} />
                            </td>
                            <td>KV</td>
                        </tr>
                    </tbody>
                </table>
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
