import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../api/custom_axios";
import NextPreviousButton from "./common/NextPreviousButton";
import { setReportId } from "../redux/features/reportIdSlice";

export default function SeparateSourceVoltageWithstandTest() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [
        separateSourceVoltageWithstandTestTable,
        setSeparateSourceVoltageWithstandTestTable,
    ] = useState(separate_source_voltage_withstand_test_table);


    const OnSeparateSourceVoltageWithstandTestTableChange = (e)=>{
        setIsAnyDataChange(true);
        const ColumnName = e.target.dataset.rowName;
        const  RowName = e.target.name;
        const NewValue = e.target.value;
        const updatedValue = {...separateSourceVoltageWithstandTestTable}
        updatedValue[ColumnName][RowName] = NewValue;
        setSeparateSourceVoltageWithstandTestTable(updatedValue);
    }


    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }

        setIsSaving(true);
        API.patch(`/separate-source-voltage-withstand-test/${idRef.current}/`, {
            withstand_test_table: separateSourceVoltageWithstandTestTable,
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
        API.get(
            `/separate-source-voltage-withstand-test/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setSeparateSourceVoltageWithstandTestTable(
                    resp_data.withstand_test_table
                );
            })
            .catch((err) => {});
    }, []);

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [
        `/measurement-of-load-loss-and-impedance/${params.reportId}`,
        `/oil-bdv/${params.reportId}`,
    ];

    return (
        <div className="main-content separate-source-withstand-test">
            <ToastContainer />
            <div className="main-content-head">
                Separated Source Voltage Withstand Test
            </div>
            <div className="head-info">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Winding Under Test</th>
                            {Object.keys(
                                separateSourceVoltageWithstandTestTable?.[
                                    "HV Winding"
                                ]
                            ).map((column_name, index) => (
                                <th key={index}>{column_name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(
                            separateSourceVoltageWithstandTestTable
                        ).map(([key, value], index) => (
                            <tr>
                                <td>{key}</td>
                                {Object.entries(value).map(([key_i, value_i],index)=>(
                                    <td key={key_i}>
                                        <input type="number" value={value_i} data-row-name={key} name={key_i} onChange={OnSeparateSourceVoltageWithstandTestTableChange} />
                                    </td>
                                ))}
                            </tr>
                        ))}
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

const separate_source_voltage_withstand_test_table = {
    "HV Winding": {
        "V Rated (KV)": null,
        "Test Volt (KV)": null,
        "Test Time (Seconds)": null,
        "Frequency (Hz)": null,
    },
    "LV Winding": {
        "V Rated (KV)": null,
        "Test Volt (KV)": null,
        "Test Time (Seconds)": null,
        "Frequency (Hz)": null,
    },
};
