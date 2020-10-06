import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>This is your dashboard</h1>
      <Link to="/whiteboard">Go to whiteboard!</Link>
    </div>
  );
}

export default Dashboard;
