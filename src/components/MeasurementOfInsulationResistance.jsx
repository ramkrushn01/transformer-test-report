import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import NextPreviousButton from "./common/NextPreviousButton";
import { useParams } from "react-router-dom";
import "../css/common/test-reports.css";
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
        hv_voltage: {value: "", unit: ""},
        lv_voltage: {value: "", unit: ""},
    });


    const OnSaveClick = (e) => {
        console.log(updatedValue);
        setIsSaving(true);
        API.patch(`/measurement-of-insulation-resistance/${idRef.current}/`, updatedValue).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");
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
    }

    const OnVoltageValueChange = (e)=>{
        const BackendName = e.target.name.split('-')[0]
        const key = e.target.name.split('-')[1]
        console.log(BackendName, key)
        setUpdatedValue((prev) => ({
            ...prev,
            [BackendName]: {
                ...prev[BackendName], // Spread existing properties of the object
                [key]: e.target.value // Update the specific key dynamically
            }
        }));
    }

    const NextPreviousButtonState = [false, true];
    const NextPrevLink = [`/transformer-information/${params.reportId}`, `/`];

    useEffect(()=>{
        dispatch(setReportId(params.reportId));
        API.get(`/measurement-of-insulation-resistance/by-customer/${params.reportId}`).then((response) => {
            idRef.current = response?.data[0]?.id;
            setUpdatedValue({
                resistance_unit: response?.data[0]?.resistance_unit,
                hv_voltage: response?.data[0]?.hv_voltage,
                lv_voltage: response?.data[0]?.lv_voltage
            })
            // toast.success(`${JSON.stringify(response.data)}`)
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
                                <select onChange={OnResistanceUnitValueChange}
                                    id="resistance-unit"
                                    className="main-input" value={updatedValue?.resistance_unit} name='resistance_unit'>
                                    <option value="MΩ">MΩ (Megaohms)</option>
                                    <option value="GΩ" selected={true} >GΩ (Gigaohms)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                               <label htmlFor="hv-voltage" className="main-label">HV VOLTAGE: </label> 
                            </td>
                            <td>
                               <input id="hv-voltage" type="number" value={updatedValue?.hv_voltage?.value} onChange={OnVoltageValueChange} name='hv_voltage-value' className="main-input" />
                            </td>
                            <td>
                               <select className="main-input" value={updatedValue?.hv_voltage?.unit} onChange={OnVoltageValueChange} name='hv_voltage-unit' >
                                <option value="V">V</option>
                                <option value="KV">KV</option>
                               </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="lv-voltage" className="main-label">LV VOLTAGE: </label>
                            </td>
                            <td>
                                <input id="lv-voltage" value={updatedValue?.lv_voltage?.value} type="number" className="main-input" onChange={OnVoltageValueChange} name='lv_voltage-value' />
                            </td>
                            <td>
                               <select  className="main-input" value={updatedValue?.lv_voltage?.unit} onChange={OnVoltageValueChange} name='lv_voltage-unit' >
                                    <option value="V">V</option>
                                    <option value="KV">KV</option>
                               </select>
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
