import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import NextPreviousButton from "./common/NextPreviousButton";
import API from "../api/custom_axios";
import { nanoid } from "nanoid";

export default function MeasurementOfCapacitanceAndTanDeltaOfWinding() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const activeInputRef = useRef(null);

    const CorrectionFactorValues = {
        10: 0.8,
        11: 0.84,
        12: 0.84,
        13: 0.86,
        14: 0.88,
        15: 0.9,
        16: 0.92,
        17: 0.94,
        18: 0.96,
        19: 0.98,
        20: 1.0,
        21: 1.024,
        22: 1.048,
        23: 1.072,
        24: 1.096,
        25: 1.12,
        26: 1.146,
        27: 1.172,
        28: 1.198,
        29: 1.224,
        30: 1.25,
        31: 1.28,
        32: 1.31,
        33: 1.34,
        34: 1.37,
        35: 1.4,
        36: 1.43,
        37: 1.46,
        38: 1.49,
        39: 1.52,
        40: 1.55,
        41: 1.59,
        42: 1.63,
        43: 1.67,
        44: 1.71,
        45: 1.75,
        46: 1.79,
        47: 1.83,
        48: 1.87,
        49: 1.91,
        50: 1.96,
        51: 1.996,
        52: 2.042,
        53: 2.088,
        54: 2.134,
        55: 2.18,
        56: 2.226,
        57: 2.272,
        58: 2.318,
        59: 2.372,
        60: 2.42,
        61: 2.476,
        62: 2.532,
        63: 2.588,
        64: 2.64,
        65: 2.664,
        66: 2.688,
        67: 2.76,
        68: 2.88,
        69: 2.94,
        70: 3.0,
    };
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const [temperature, setTemperature] = useState();
    const [correctionFactor, setCorrectionFactor] = useState();
    const [hvLeadToHVAndLVLeadToLV, setHVLeadToHVAndLVLeadToLV] = useState(
        hv_lead_to_hv_and_lv_lead_to_lv
    );
    const [hvLeadToLVAndLVLeadToHV, setHVLeadToLVAndLVLeadToHV] = useState(
        hv_lead_to_hv_and_lv_lead_to_lv
    );

    const onTemperatureChange = (e) => {
        setIsAnyDataChange(true);
        const TempValue = e.target.value;
        setTemperature(TempValue);
        setCorrectionFactor(CorrectionFactorValues[Math.round(TempValue)]);
    };

    const OnHVLeadToHVAndLVLeadToLV = (e) => {
        setIsAnyDataChange(true);
        const ColumnName = e.target.name;
        const RowName = e.target.dataset.rowName;
        const NewValue = e.target.value;

        const NewHVLeadToHVAndLVLeadToLV = { ...hvLeadToHVAndLVLeadToLV };
        NewHVLeadToHVAndLVLeadToLV[ColumnName][RowName] = NewValue;
        setHVLeadToHVAndLVLeadToLV(NewHVLeadToHVAndLVLeadToLV);
    };

    const OnHVLeadToLVAndLVLeadToHV = (e) => {
        setIsAnyDataChange(true);
        const ColumnName = e.target.name;
        const RowName = e.target.dataset.rowName;
        const NewValue = e.target.value;
        const NewHVLeadToLVAndLVLeadToHV = {...hvLeadToLVAndLVLeadToHV};
        NewHVLeadToLVAndLVLeadToHV[ColumnName][RowName] = NewValue;
        setHVLeadToLVAndLVLeadToHV(NewHVLeadToLVAndLVLeadToHV);

    };

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }

        setIsSaving(true);
        API.patch(
            `/measurement-of-capacitance-and-tan-delta-of-winding/${idRef.current}/`,
            {
                temperature: temperature,
                correction_factor: correctionFactor,
                hv_lead_to_hv_and_lv_lead_to_lv: hvLeadToHVAndLVLeadToLV,
                hv_lead_to_lv_and_lv_lead_to_hv: hvLeadToLVAndLVLeadToHV,
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
            `/measurement-of-capacitance-and-tan-delta-of-winding/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setTemperature(resp_data?.temperature);
                setCorrectionFactor(resp_data?.correction_factor);
                setHVLeadToHVAndLVLeadToLV(
                    resp_data?.hv_lead_to_hv_and_lv_lead_to_lv
                );
                setHVLeadToLVAndLVLeadToHV(
                    resp_data?.hv_lead_to_lv_and_lv_lead_to_hv
                );
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [hvLeadToHVAndLVLeadToLV, hvLeadToLVAndLVLeadToHV]);

    const NextPreviousButtonState = [false, true];
    const NextPrevLink = [`/induced-over-voltage-test/${params.reportId}`, `/`];

    return (
        <div className="main-content tan-delta-winding">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Capacitance and Tan Delta of Winding
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    htmlFor="temperature"
                                    className="main-label">
                                    TEMPERATURE:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="temp"
                                    id="temperature"
                                    onChange={onTemperatureChange}
                                    value={temperature}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="correction-factor"
                                    className="main-label">
                                    CORRECTION FACTOR:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    value={correctionFactor}
                                    readOnly={true}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr style={{ marginBlock: "20px" }} />
                <h3 className="table-name">
                    Test Lead Connection HV Lead to HV and LV Lead to LV
                </h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Sr.NO.</th>
                            {Object.keys(
                                hvLeadToHVAndLVLeadToLV?.[
                                    Object.keys(
                                        hvLeadToHVAndLVLeadToLV || {}
                                    )[0]
                                ] || {}
                            )?.map((key) =>
                                key.toLowerCase() ===
                                "measured % tan delta @ " ? (
                                    <th key={nanoid()}>
                                        {key} {temperature}°C
                                    </th>
                                ) : (
                                    <th key={nanoid()}>{key}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(hvLeadToHVAndLVLeadToLV).map(
                            ([key, value], index) => (
                                <tr key={nanoid()}>
                                    <td>{key}</td>
                                    {Object.entries(value).map(
                                        ([key_i, value_i], index) => (
                                            <td key={nanoid()}>
                                                {key_i.toLowerCase() ===
                                                    "test mode" ||
                                                key_i.toLowerCase() ===
                                                    "insulation tested" ? (
                                                    value_i
                                                ) : (
                                                    <input
                                                        id={`${key}_${key_i}`}
                                                        onFocus={(e) => {
                                                            activeInputRef.current =
                                                                e.target.id;
                                                        }}
                                                        type="number"
                                                        value={value_i}
                                                        data-row-name={key_i}
                                                        name={key}
                                                        onChange={
                                                            OnHVLeadToHVAndLVLeadToLV
                                                        }
                                                    />
                                                )}
                                            </td>
                                        )
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                <hr style={{ marginBlock: "20px" }} />
                <h3 className="table-name">
                    Test Lead Connection HV Lead to LV and LV Lead to HV
                </h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Sr.NO.</th>
                            {Object.keys(
                                hvLeadToLVAndLVLeadToHV?.[
                                    Object.keys(
                                        hvLeadToLVAndLVLeadToHV || {}
                                    )[0]
                                ] || {}
                            )?.map((key) =>
                                key.toLowerCase() ===
                                "measured % tan delta @ " ? (
                                    <th key={nanoid()}>
                                        {key} {temperature}°C
                                    </th>
                                ) : (
                                    <th key={nanoid()}>{key}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(hvLeadToLVAndLVLeadToHV).map(
                            ([key, value], index) => (
                                <tr key={nanoid()}>
                                    <td>{key}</td>
                                    {Object.entries(value).map(
                                        ([key_i, value_i], index) => (
                                            <td key={nanoid()}>
                                                {key_i.toLowerCase() ===
                                                    "test mode" ||
                                                key_i.toLowerCase() ===
                                                    "insulation tested" ? (
                                                    value_i
                                                ) : (
                                                    <input
                                                        id={`${key}_${key_i}_2`}
                                                        onFocus={(e) => {
                                                            activeInputRef.current =
                                                                e.target.id;
                                                        }}
                                                        type="number"
                                                        value={value_i}
                                                        data-row-name={key_i}
                                                        name={key}
                                                        onChange={
                                                            OnHVLeadToLVAndLVLeadToHV
                                                        }
                                                    />
                                                )}
                                            </td>
                                        )
                                    )}
                                </tr>
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

const hv_lead_to_hv_and_lv_lead_to_lv = {
    1: {
        "Test Mode": "UST",
        "Insulation Tested": "CHL",
        "Test Voltage": "10 KV",
        "Capacitance (pF)": null,
        "Measured % Tan Delta @ ": null,
        "% Corrected Tan Delta at 20°C": null,
    },
    2: {
        "Test Mode": "GSTg",
        "Insulation Tested": "CHG",
        "Test Voltage": "10 KV",
        "Capacitance (pF)": null,
        "Measured % Tan Delta @ ": null,
        "% Corrected Tan Delta at 20°C": null,
    },
    3: {
        "Test Mode": "GST-GND",
        "Insulation Tested": "CHG+CHL",
        "Test Voltage": "10 KV",
        "Capacitance (pF)": null,
        "Measured % Tan Delta @ ": null,
        "% Corrected Tan Delta at 20°C": null,
    },
};
