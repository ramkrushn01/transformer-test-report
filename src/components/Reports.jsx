import React, { useEffect, useState } from 'react';
import "../css/reports.css";
import API from '../api/custom_axios';
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReportId } from '../redux/features/reportIdSlice';

export default function Reports() {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const dispatch =  useDispatch();

    const gotoReport = (id)=>{
        navigate(`/customer-details/${id}`);
        dispatch(setReportId(id));
    }

    useEffect(() => {
        API.get('customer-details/').then((response) => {
            setData(response.data);
        }).catch((err) => {
            
        });
    }, [])

  return (
      <div className="main-reports">
        <h1 className="reports-head">Reports</h1>

          <div className="table-container">
              <table className="styled-table">
                  <thead>
                      <tr>
                          {/* <th>ID</th> */}
                          <th>Customer Name</th>
                          <th>Work Order</th>
                          <th>Certificate No</th>
                          <th>Transformer Make</th>
                          <th>Serial No</th>
                          <th>Rating</th>
                          <th>Reference Standard</th>
                          <th>Testing Date</th>
                          <th>Remark</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {data?.map((item) => (
                          <tr key={item.id} onClick={()=>{gotoReport(item.id)}}>
                              {/* <td>{item.id}</td> */}
                              <td>{item.customer_name}</td>
                              <td>{item.work_order_number}</td>
                              <td>{item.certificate_number}</td>
                              <td>{item.transformer_make}</td>
                              <td>{item.serial_number}</td>
                              <td>{item.rating}</td>
                              <td>{item.reference_standard}</td>
                              <td>{item.testing_date}</td>
                              <td>{item.remark}</td>
                              <td><MdDeleteForever size={"30px"} /></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
}
