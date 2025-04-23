import React, { useEffect, useRef, useState } from "react";
import "../css/induced-over-voltage-test.css";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import NextPreviousButton from "./common/NextPreviousButton";
import API from "../api/custom_axios";
import { setReportId } from "../redux/features/reportIdSlice";

export default function InducedOverVoltageTest() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [inducedOverVoltageTest, setInducedOverVoltageTest] = useState({});

    const OnInducedOverVoltageTestChange = (e) => {
        setIsAnyDataChange(true);
        const name = e.target.name;
        setInducedOverVoltageTest((prev) => ({
            ...prev, 
            [name]: e.target.value,
        }));
    };

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }

        setIsSaving(true);
        API.patch(`/induced-over-voltage-test/${idRef.current}/`, {
            induced_over_voltage_test_table: inducedOverVoltageTest,
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
        API.get(`/induced-over-voltage-test/by-customer/${params.reportId}/`)
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setInducedOverVoltageTest(
                    resp_data.induced_over_voltage_test_table
                );
            })
            .catch((err) => {});
    }, []);

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [`/oil-bdv/${params.reportId}`, `/measurement-of-capacitance-and-tan-delta-of-winding/${params.reportId}`];

    return (
        <div className="main-content induced-over-voltage-test">
            <ToastContainer />
            <div className="main-content-head">Induced Over Voltage Test</div>
            <div className="head-info">
                <table className="report-table">
                    <thead>
                        <tr>
                            {Object.keys(inducedOverVoltageTest).map(
                                (key, index) => (
                                    <th>{key}</th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.entries(inducedOverVoltageTest).map(
                                ([key, value], index) => (
                                    <td key={index}>
                                        <input
                                            type="number"
                                            value={value}
                                            name={key}
                                            onChange={
                                                OnInducedOverVoltageTestChange
                                            }
                                        />
                                    </td>
                                )
                            )}
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
