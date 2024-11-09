import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function PendingTasks() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signinadmin");
    } else if (user.interface !== "admin") {
      navigate("/");
    } else {
      fetchPendingActions();
    }
  }, [user, loading, navigate]);

  const fetchPendingActions = async () => {
    try {
      const response = await axios.get("/pending-actions");
      setActions(response.data);
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  };

  const toggleActionStatus = (actionId, currentStatus) => {
    confirmAlert({
      title: "Confirm Status Change",
      message: `Are you sure you want to mark this action as ${currentStatus === "pending" ? "resolved" : "pending"}?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const newStatus = currentStatus === "pending" ? "resolved" : "pending";
            try {
              await axios.put(`/update-action-status/${actionId}`, {
                status: newStatus,
              });

              setActions((prevActions) =>
                prevActions.map((action) =>
                  action._id === actionId ? { ...action, status: newStatus } : action
                )
              );
            } catch (error) {
              console.error("Failed to update action status:", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
          className: "noButtonStyle",
        },
      ],
    });
  };

  const renderActionIdLabel = (action) => {
    switch (action.type) {
      case "booking":
        return `Booking ID - ${action.dataId}`;
      case "listing_approval":
        return `Listing ID - ${action.dataId}`;
      case "refund_appeal":
        return `Booking ID - ${action.dataId}`;
      case "general":
        return `Data ID - ${action.dataId}`;
      default:
        return `Data ID - ${action.dataId}`;
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Administrator</h1>
        <img src="../assets/linear_bg.png" className="shade_bg" alt="Background pattern" />
        <div className="shade_item">
          <img src="../assets/bg (2).png" alt="Partner image 1" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (1).png" alt="Partner image 2" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (4).png" alt="Partner image 3" />
        </div>
        <div className="shade_item">
          <img src="../assets/bg (3).png" alt="Partner image 4" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage smash apartments</p>
        </div>
        <div className="action_lists">
          {actions.map((action) => (
            <div key={action._id} className="action_item">
              <p>{renderActionIdLabel(action)}</p>
              <p>{action.message}</p>
              <button
                onClick={() => toggleActionStatus(action._id, action.status)}
                style={{
                  backgroundColor: action.status === "resolved" ? "green" : "red",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {action.status === "resolved" ? "Resolved" : "Pending"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
