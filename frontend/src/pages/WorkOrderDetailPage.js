// pages/WorkOrderDetailPage.js
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkOrderDetail from "../components/WorkOrderDetail"; // reutiliza tu modal/componente

function WorkOrderDetailPage({ usuario }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    axios.get(`/api/workorders/${id}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    }).then((res) => setOrder(res.data));
  }, [id]);
  return (
    <WorkOrderDetail
      open={true}
      onClose={() => window.history.back()} // o navigate(-1)
      order={order}
      usuario={usuario}
      onStatusChange={() => {}}
    />
  );
}
export default WorkOrderDetailPage;
