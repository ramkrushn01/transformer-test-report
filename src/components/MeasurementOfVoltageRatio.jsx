import React, { useEffect, useRef, useState } from "react";
import API from "../api/custom_axios";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import { toast, ToastContainer } from "react-toastify";
import NextPreviousButton from "./common/NextPreviousButton";
import { nanoid } from "nanoid";

export default function MeasurementOfVoltageRatio() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const [voltageRatioReportTableData, setVoltageRatioReportTableData] = useState({});
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const activeInputRef = useRef(null);
    

    const OnSaveClick = (e)=>{
        if(!isAnyDataChange){
            toast.info("Info! Nothing to save", {autoClose: 1000});
            return
        }
        setIsSaving(true);
        API.patch(`/measurement-of-voltage-ratio/${idRef.current}/`, {'voltage_ratio_table':voltageRatioReportTableData}).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");            
            setIsAnyDataChange(false);
        }).catch((err) => {
            setIsSaving(false);
            toast.error(`Error! ${err}`);
        });

    }

    const updateReportTableData = (tableName, rowName, columnName, newValue) => {
        setVoltageRatioReportTableData(prevData => ({
            ...prevData,
            [tableName]: {  // Update or create the table dynamically
                ...prevData[tableName],  
                [rowName]: {  // Update or create the row dynamically
                    ...prevData[tableName]?.[rowName], 
                    [columnName]: newValue  // Set the new value for the column
                }
            }
        }));
    };

    const CalculateAndSetErrorsValues = (tableName, rowName, columnName, newValue, e)=>{
        const StandardValue = voltageRatioReportTableData[tableName][rowName]['Standard Ratio'];
        const ErrorValue = (((newValue - StandardValue)/newValue) * 100).toFixed(4);
        updateReportTableData(tableName, rowName, `% Error ${columnName}` ,ErrorValue);
        // console.log(ErrorValue);
        // console.log(e.target.classList);
        console.log(e.currentTarget)
        // e.target.classList.add("error-value");
        if (ErrorValue > -0.5 && ErrorValue < 0.5) {
            // console.log("Value is between -0.5 and 0.5");
        } else {
            e.target.style.color = "red";
            // console.log("Value is outside the range");
        }
    }

    const OnReportDataChange = (e)=>{
        setIsAnyDataChange(true);
        const tableName = e.target.dataset.tableName;
        const columnName = e.target.name;
        const rowName = e.target.dataset.rowName;
        const newValue = e.target.value;
        CalculateAndSetErrorsValues(tableName, rowName, columnName, newValue, e);
        updateReportTableData(tableName, rowName, columnName, newValue);
    }


    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [`/measurement-of-insulation-resistance/${params.reportId}`, `/magnetic-balance-and-magnetizing-current-test/${params.reportId}`]
    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(`/measurement-of-voltage-ratio/by-customer/${params.reportId}`).then((response) => {
                idRef.current = response?.data[0]?.id;
                setVoltageRatioReportTableData(response?.data[0]?.voltage_ratio_table);
            }).catch((err) => {

            });
    }, []);


    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [voltageRatioReportTableData])
    
    return (
        <div className="main-content voltage-ratio">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Voltage Ratio
            </div>
            <div className="head-info">
                {Object.entries(voltageRatioReportTableData).map(
                    ([table_name, table_content]) => (
                        <>
                            <h3 className="table-name">{table_name}</h3>
                            <table key={nanoid()} className="report-table">
                                <thead>
                                    <tr>
                                        <th>TAP NO</th>
                                        {
                                            Object.entries(table_content[Object.keys(table_content)[0]]).map(([row_name]) => (
                                                <th key={nanoid()}>{row_name}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.entries(table_content).map(([key,value])=>(
                                            <tr key={nanoid()}>
                                                <td>{key}</td>
                                                {Object.entries(value).map(
                                                    ([key_i, value_i]) => (
                                                        <td key={key_i} title={`${key} ${key_i}`}>
                                                            {
                                                                key_i.toLowerCase() === 'standard ratio' || key_i.includes("% Error") ? 
                                                                value_i :
                                                                <input id={`${table_name}_${key}_${key_i}`} className={(value[`% Error ${key_i}`] > 0.5 || value[`% Error ${key_i}`] < -0.5) && "error-value"} onFocus={(e)=>{activeInputRef.current=e.target.id}} type="number" value={value_i} data-row-name={key} data-table-name={table_name} name={key_i} onChange={OnReportDataChange}  />
                                                            }
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        <hr style={{ marginBlock: "20px" }} />
                        </>
                    )
                )}
            </div>
            <p className="report-note">Interpretation: Since % error at all taps is less than ±0.5%, Test has passed. </p>
            <NextPreviousButton
                isSaving={isSaving}
                OnSaveClick={OnSaveClick}
                State={NextPreviousButtonState}
                NextPrevLink={NextPrevLink}
            />
        </div>
    );
}
