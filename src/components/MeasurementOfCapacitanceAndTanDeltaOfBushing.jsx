import React, { useEffect, useRef, useState } from "react";
import "../css/measurement-of-capacitance-and-tan-delta-of-bushing.css";
import { toast, ToastContainer } from "react-toastify";
import NextPreviousButton from "./common/NextPreviousButton";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { setReportId } from "../redux/features/reportIdSlice";

export default function MeasurementOfCapacitanceAndTanDeltaOfBushing() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const activeInputRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);

    const [temperature, setTemperature] = useState();

    const onTemperatureChange = (e) => {
        setIsAnyDataChange(true);
        const TempValue = e.target.value;
        setTemperature(TempValue);
    };

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }

        setIsSaving(true);
        API.patch(
            `/measurement-of-capacitance-and-tan-delta-of-bushing/${idRef.current}/`,
            {
                temperature: temperature,
            }
        )
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

        API.get(
            `/measurement-of-capacitance-and-tan-delta-of-bushing/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setTemperature(resp_data?.temperature);
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, []);

    const NextPreviousButtonState = [false, true];
    const NextPrevLink = [
        `/measurement-of-capacitance-and-tan-delta-of-winding/${params.reportId}`,
        `/`,
    ];

    return (
        <div className="main-content tan-delta-bushing">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Capacitance and Tan Delta of Bushing
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    htmlFor="temperature"
                                    className="main-label">
                                    TEMPERATURE:{" "}
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="temp"
                                    id="temperature"
                                    value={temperature}
                                    onChange={onTemperatureChange}
                                />
                            </td>
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
