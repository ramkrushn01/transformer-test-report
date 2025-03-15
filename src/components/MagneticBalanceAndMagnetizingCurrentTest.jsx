import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { nanoid } from "nanoid";
import NextPreviousButton from "./common/NextPreviousButton";

export default function MagneticBalanceAndMagnetizingCurrentTest() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [hvSide, setHVSide] = useState({});
    const [lvSide, setLVSide] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const activeInputRef = useRef(null);


      const OnSaveClick = (e)=>{
        if(!isAnyDataChange){
            toast.info("Info! Nothing to save", {autoClose: 1000});
            return
        }
        setIsSaving(true);
        API.patch(`/magnetic-balance-and-magnetizing-current-test/${idRef.current}/`, {"hv_side":hvSide, 'lv_side': lvSide}).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");
            setIsAnyDataChange(false);
        }).catch((err) => {
            setIsSaving(false);
            toast.error(`Error! ${err}`);
        });

    }

    const OnHVSideChange = (e)=>{
      const RowName = e.target.dataset.rowName;
      const ColumnName = e.target.name; 
      const NewValue = e.target.value;
      const NewHVSide = {...hvSide}
      NewHVSide[ColumnName][RowName] = NewValue;
      setHVSide(NewHVSide);
      setIsAnyDataChange(true);
    }

    const OnLVSideChange = (e)=>{
      const TableName = e.target.dataset.tableName;
      const ColumnName = e.target.name;
      const RowName = e.target.dataset.rowName;
      const NewValue = e.target.value;
      const NewLVSide = {...lvSide};
      NewLVSide[TableName][ColumnName][RowName] = NewValue;
      console.log(NewLVSide);
      setLVSide(NewLVSide);
      setIsAnyDataChange(true);
    }

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(`/magnetic-balance-and-magnetizing-current-test/by-customer/${params.reportId}`).then((response) => {
          const resp_data = response?.data[0]
          idRef.current = resp_data.id;
          setHVSide(resp_data.hv_side);
          setLVSide(resp_data.lv_side);
        }).catch((err) => {
          
        });
    }, []);

    useEffect(() => {
      document.getElementById(activeInputRef.current)?.focus();
    }, [hvSide, lvSide])
    

    const NextPreviousButtonState = [false, true];
    const NextPrevLink = [`/measurement-of-voltage-ratio/${params.reportId}`, `/measurement-of-winding-resistance/${params.reportId}`]

    return (
        <div className="main-content magnetizing-balance-current">
            <ToastContainer />
            <div className="main-content-head">
                Magnetizing Balance and Magnetizing Current Test
            </div>
            <div className="head-info">
                <h3 className="table-name">FROM HV SIDE</h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            {Object.keys(
                                hvSide?.[Object.keys(hvSide || {})[0]] || {}
                            )?.map((key) => (
                                <th key={nanoid()}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(hvSide).map(([key, value]) => (
                            <tr key={nanoid()}>
                                {Object.entries(value).map(
                                    ([key_i, value_i]) => (
                                        <td>
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
                                                onChange={OnHVSideChange}
                                            />
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="head-info">
                {Object.entries(lvSide).map(([table_name, table_content]) => (
                    <>
                        <h3 className="table-name" key={nanoid()}>
                            FROM {table_name} SIDE
                        </h3>
                        <table className="report-table" key={nanoid()}>
                            <thead>
                                <tr>
                                    {Object.keys(table_content?.[Object.keys(table_content)[0]] || {}).map((key) => (
                                        <th>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(table_content).map(
                                    ([key, value]) => (
                                        <tr>
                                            {Object.entries(value).map(
                                                ([key_i, value_i]) => (
                                                    <td>
                                                        <input
                                                            type="number"
                                                            id={`${table_name}_${key}_${key_i}`}
                                                            title={`${key} ${key_i}`}
                                                            value={value_i}
                                                            data-row-name={
                                                                key_i
                                                            }
                                                            name={key}
                                                            data-table-name={
                                                                table_name
                                                            }
                                                            onChange={
                                                                OnLVSideChange
                                                            }
                                                            onFocus={(e) => {
                                                                activeInputRef.current =
                                                                    e.target.id;
                                                            }}
                                                        />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </>
                ))}
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
