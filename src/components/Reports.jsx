import React, { useEffect, useState } from 'react';
import "../css/reports.css";
import API from '../api/custom_axios';
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReportId } from '../redux/features/reportIdSlice';
import Loading from './common/Loading';

export default function Reports() {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const dispatch =  useDispatch();

    const gotoReport = (e,id)=>{
        if(e.target.className === "btn-delete" || e.target.tagName === "svg" || e.target.tagName === "path"){
            return
        }
        navigate(`/customer-details/${id}`);
        dispatch(setReportId(id));
    }

    const DeleteReport = (id)=>{
        API.delete(`customer-details/${id}`).then((response) => {
            setData(data.filter(item=> item.id !== id ));
        }).catch((err) => {

        });
    }

    useEffect(() => {
        API.get('customer-details/').then((response) => {
            setData(response.data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        });
    }, [])

  return (
      <div className="main-reports">
          <h1 className="reports-head">Reports</h1>

          <div className="table-container">
              <table className="styled-table">
                  <thead>
                      <tr>
                          <th>Sr.No.</th>
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
                      {data?.map((item, index) => (
                          <tr
                              key={item.id}
                              onClick={(e) => {
                                  gotoReport(e, item.id);
                              }}>
                              <td>{index + 1}</td>
                              <td>{item.customer_name}</td>
                              <td>{item.work_order_number}</td>
                              <td>{item.certificate_number}</td>
                              <td>{item.transformer_make}</td>
                              <td>{item.serial_number}</td>
                              <td>{item.rating}</td>
                              <td>{item.reference_standard}</td>
                              <td>{item.testing_date}</td>
                              <td>{item.remark}</td>
                              <td
                                  className="btn-delete"
                                  onClick={() => {
                                      DeleteReport(item.id);
                                  }}>
                                  <MdDeleteForever
                                      className="btn-delete"
                                      size={"30px"}
                                  />
                              </td>
                          </tr>
                      ))}

                      {loading ? (
                          <tr>
                              <td className="no-record" colSpan="11">
                                  <Loading size="30px" />
                              </td>
                          </tr>
                      ) : (
                          !data && (
                              <tr>
                                  <td className="no-record" colSpan="11">
                                      No Record Found.
                                  </td>
                              </tr>
                          )
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
}
