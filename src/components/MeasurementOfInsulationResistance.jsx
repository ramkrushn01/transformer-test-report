import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import NextPreviousButton from "./common/NextPreviousButton";
import { useAsyncValue, useParams } from "react-router-dom";
import "../css/common/test-reports.css";
import "../css/measurement-of-insulation-resistance.css"
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import API from "../api/custom_axios";

export default function MeasurementOfInsulationResistance() {
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    const idRef = useRef();
    const params = useParams();
    const [updatedValue, setUpdatedValue] = useState({
        resistance_unit: "",
        top_oil_temp: "",
        hv_voltage: {value: "", unit: ""},
        lv_voltage: {value: "", unit: ""},
        report_table : {},
    });

    const [isAnyDataChange, setIsAnyDataChange] = useState(false);


    const OnSaveClick = (e) => {
        if(!isAnyDataChange){
            toast.info("Info! Nothing to save",{autoClose:1000})
            return
        }
        setIsSaving(true);
        API.patch(`/measurement-of-insulation-resistance/${idRef.current}/`, updatedValue).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");
            setIsAnyDataChange(false);
        }).catch((err) => {
            setIsSaving(false);
            toast.error(`Error! ${err}`);
        });
    };

    const OnResistanceUnitValueChange = (e)=>{
        setUpdatedValue((prev)=>({
            ...prev,
            'resistance_unit' : e.target.value,
        }));
        setIsAnyDataChange(true);
    }

    const OnTopOilTempValueChange = (e)=>{
        setUpdatedValue((prev)=>({
            ...prev,
            'top_oil_temp' : e.target.value,
        }));
        setIsAnyDataChange(true);
    }

    const OnVoltageValueChange = (e)=>{
        const BackendName = e.target.name.split('-')[0]
        const key = e.target.name.split('-')[1]
        setUpdatedValue((prev) => ({
            ...prev,
            [BackendName]: {
                ...prev[BackendName], // Spread existing properties of the object
                [key]: e.target.value // Update the specific key dynamically
            }
        }));
        setIsAnyDataChange(true);
    }


  

    const updateReportTableData = (rowName, columnName, newValue) => {
        setUpdatedValue(prevData => ({
            ...prevData,
            report_table: {
                ...prevData.report_table,  
                [rowName]: {
                    ...prevData.report_table[rowName],
                    [columnName]: newValue
                }
            }
        }));
    };
    
    const calculateAndSetPIValue = (rowName, columnName, newValue)=>{
        if(rowName === '60 SEC'){
            const Sec600Value = updatedValue['report_table']['600 SEC'][columnName]
            const PIValue = (Sec600Value / newValue).toFixed(4);
            updateReportTableData('PI', columnName, PIValue);
        } else if(rowName === '600 SEC'){
            const Sec60Value = updatedValue['report_table']['60 SEC'][columnName]
            const PIValue = (newValue / Sec60Value).toFixed(4);
            updateReportTableData('PI', columnName, PIValue);
        }
    }

    const OnReportDataChange = (e)=>{
        const rowName = e.target.dataset.rowName;
        const columnName = e.target.name;
        const newValue = e.target.value; 
        updateReportTableData(rowName, columnName, newValue);
        calculateAndSetPIValue(rowName, columnName, newValue);
        setIsAnyDataChange(true);
    }

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [`/transformer-information/${params.reportId}`, `/measurement-of-voltage-ratio/${params.reportId}`];

    useEffect(()=>{
        dispatch(setReportId(params.reportId));
        API.get(`/measurement-of-insulation-resistance/by-customer/${params.reportId}`).then((response) => {
            idRef.current = response?.data[0]?.id;
            setUpdatedValue({
                resistance_unit: response?.data[0]?.resistance_unit || "MΩ",
                top_oil_temp: response?.data[0]?.top_oil_temp,
                hv_voltage: response?.data[0]?.hv_voltage,
                lv_voltage: response?.data[0]?.lv_voltage,
                report_table: response?.data[0]?.report_table
            })

        }).catch((err) => {
            toast.error(`Error! ${err}`)
        });
    }, []);

    
    return (
        <div className="main-content insulation-resistance">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Insulation Resistance
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    htmlFor="resistance-unit"
                                    className="main-label">
                                    RESISTANCE UNIT :{" "}
                                </label>
                            </td>
                            <td>
                                <select
                                    onChange={OnResistanceUnitValueChange}
                                    id="resistance-unit"
                                    className="main-input"
                                    value={updatedValue?.resistance_unit}
                                    name="resistance_unit">
                                    <option value="MΩ">MΩ (Megaohms)</option>
                                    <option value="GΩ" selected={true}>
                                        GΩ (Gigaohms)
                                    </option>
                                </select>
                            </td>
                        </tr>
                        {/*  */}
                        <tr>
                            <td>
                                <label
                                    htmlFor="hv-voltage"
                                    className="main-label">
                                    TOP OIL TEMP (°C):{" "}
                                </label>
                            </td>
                            <td>
                                <input
                                    id="hv-voltage"
                                    type="number"
                                    value={updatedValue?.top_oil_temp}
                                    onChange={OnTopOilTempValueChange}
                                    name="top_oil_temp"
                                    className="main-input"
                                />
                            </td>
                        </tr>
                        {/*  */}
                        <tr>
                            <td>
                                <label
                                    htmlFor="hv-voltage"
                                    className="main-label">
                                    HV TEST VOLTAGE (DC):{" "}
                                </label>
                            </td>
                            <td>
                                <input
                                    id="hv-voltage"
                                    type="number"
                                    value={updatedValue?.hv_voltage?.value}
                                    onChange={OnVoltageValueChange}
                                    name="hv_voltage-value"
                                    className="main-input"
                                />
                            </td>
                            <td>
                                <select
                                    className="main-input"
                                    value={updatedValue?.hv_voltage?.unit}
                                    onChange={OnVoltageValueChange}
                                    name="hv_voltage-unit">
                                    <option value="V">V</option>
                                    <option value="KV">KV</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="lv-voltage"
                                    className="main-label">
                                    LV TEST VOLTAGE (DC):{" "}
                                </label>
                            </td>
                            <td>
                                <input
                                    id="lv-voltage"
                                    value={updatedValue?.lv_voltage?.value}
                                    type="number"
                                    className="main-input"
                                    onChange={OnVoltageValueChange}
                                    name="lv_voltage-value"
                                />
                            </td>
                            <td>
                                <select
                                    className="main-input"
                                    value={updatedValue?.lv_voltage?.unit}
                                    onChange={OnVoltageValueChange}
                                    name="lv_voltage-unit">
                                    <option value="V">V</option>
                                    <option value="KV">KV</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* report_table */}
                <table className="report-table">
                    <thead>
                        <tr className="bg-gray-200">
                            <th>TIME</th>
                            {Object.keys(
                                updatedValue?.report_table?.[
                                    Object.keys(
                                        updatedValue?.report_table || {}
                                    )[0]
                                ] || {}
                            ).map((col, index) => (
                                <th
                                    key={index}
                                    className="border p-2 text-left">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(updatedValue?.report_table || {}).map(
                            ([key, value]) => (
                                <tr>
                                    <td>{key}</td>
                                    {Object.entries(value).map(
                                        ([key_i, value_i]) => (
                                            <td key={key_i}>
                                                {
                                                    key === "PI" ?
                                                    value_i 
                                                    :
                                                    <input type="number" value={value_i} data-row-name={key} name={key_i} onChange={OnReportDataChange} />
                                                }
                                            </td>
                                        )
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                {/* /report_table */}
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
