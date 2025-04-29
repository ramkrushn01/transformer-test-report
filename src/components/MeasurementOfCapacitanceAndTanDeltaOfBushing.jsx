import React, { useEffect, useRef, useState } from "react";
import "../css/measurement-of-capacitance-and-tan-delta-of-bushing.css";
import { toast, ToastContainer } from "react-toastify";
import NextPreviousButton from "./common/NextPreviousButton";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { setReportId } from "../redux/features/reportIdSlice";
import { nanoid } from "nanoid";

export default function MeasurementOfCapacitanceAndTanDeltaOfBushing() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const activeInputRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);

    const [temperature, setTemperature] = useState();
    const [bushingTableStructure, setBushingTableStructure] = useState({});

    const onTemperatureChange = (e) => {
        setIsAnyDataChange(true);
        const TempValue = e.target.value;
        setTemperature(TempValue);
    };

    const OnBushingTableStructChange = (e) => {
        setIsAnyDataChange(true);
        const key = e.target.dataset.key;
        const keyI = e.target.dataset.keyI;
        const keyJ = e.target.dataset.keyJ;
        const newValue = e.target.value;
        const newBushingTableStructure = {...bushingTableStructure};
        newBushingTableStructure[key][keyI][keyJ] = newValue;
        setBushingTableStructure(newBushingTableStructure); 

        console.log(key, keyI, keyJ);

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
                bushing_table_structure: bushingTableStructure,
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
                setBushingTableStructure(resp_data?.bushing_table_structure);
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [bushingTableStructure]);

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
                        <tr className="temp-tr">
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
                {/* <hr style={{ marginBlock: "20px" }} /> */}
                <h3 className="table-name">C1</h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>Test Voltage</th>
                            <th colSpan={2}>10KV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(bushingTableStructure).map(
                            ([key, value], index) => (
                                <>
                                    <tr>
                                        <td colSpan={4} className="table-sub-head">{key}</td>
                                    </tr>
                                    {Object.entries(value).map(
                                        ([key_i, value_i], index_i) => (
                                            <tr key={nanoid()}>
                                                {Object.entries(value_i).map(
                                                    (
                                                        [key_j, value_j],
                                                        index_j
                                                    ) => (
                                                        <>
                                                            <td>{key_j}</td>
                                                            <td>
                                                                <input
                                                                id={`${key}_${key_i}_${key_j}`}
                                                                    className="bushing-text-input"
                                                                    data-key={
                                                                        key
                                                                    }
                                                                    data-key-i={
                                                                        key_i
                                                                    }
                                                                    data-key-j={
                                                                        key_j
                                                                    }
                                                                    onFocus={(
                                                                        e
                                                                    ) => {
                                                                        activeInputRef.current =
                                                                            e.target.id;
                                                                    }}
                                                                    type={
                                                                        key_j.includes(
                                                                            "Make"
                                                                        ) ||
                                                                        key_j.includes(
                                                                            "Sr. No"
                                                                        )
                                                                            ? "text"
                                                                            : "number"
                                                                    }
                                                                    value={
                                                                        value_j
                                                                    }
                                                                    onChange={
                                                                        OnBushingTableStructChange
                                                                    }
                                                                />
                                                            </td>
                                                        </>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </>
                            )
                        )}
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
