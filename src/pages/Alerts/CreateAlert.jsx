import React, { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { useApi } from "../../API/Api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Alerts.scss";

function CreateAlert() {
  const { fetchData } = useApi();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    alertType: "buyer",
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    price: "",
    notes: "",
  });

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("User not logged in!");
      return;
    }

    const requestType =
      form.alertType === "buyer" ? "CreateBuyerAlert" : "CreateSellerAlert";

    const payload =
      form.alertType === "buyer"
        ? {
            UserID: user.id,
            Location: form.location,
            PropertyType: form.propertyType,
            MinPrice: form.minPrice,
            MaxPrice: form.maxPrice,
            AdditionalNotes: form.notes,
            AlertDate: new Date().toISOString(),
          }
        : {
            UserID: user.id,
            Location: form.location,
            PropertyType: form.propertyType,
            Price: form.price,
            AdditionalNotes: form.notes,
            AlertDate: new Date().toISOString(),
          };

    try {
      const res = await fetchData(requestType, payload);

      if (res) {
        // Extract ID from response if available
        const newAlert = {
          ...payload,
          isNew: true,
          BuyerAlertID: res.BuyerAlertID || null,
          SellerAlertID: res.SellerAlertID || null,
        };

        if (!newAlert.BuyerAlertID && !newAlert.SellerAlertID) {
          alert(
            "Alert created, but backend did not return ID. Please refresh to see it."
          );
        } else {
          alert("Alert created successfully!");
        }

        navigate("/alerts", { state: { newAlert } });
      } else {
        alert("Failed to create alert. Please try again.");
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      alert("Something went wrong while creating alert.");
    }
  };

  return (
    <div style={{ display: "flex",marginLeft:"190px" }}>
      <Sidebar />
      <div className="alerts-container" style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <div className="alerts-header-section">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/alerts")}
          >
            &larr; Back
          </button>
          <h2 className="alerts-header">Create Alert</h2>
        </div>

        <form className="create-alert-form" onSubmit={handleSubmit}>
          {/* Alert Type */}
          <div className="form-group">
            <label>Alert Type</label>
            <select
              name="alertType"
              value={form.alertType}
              onChange={handleChange}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Property Type */}
          <div className="form-group property-type-group">
            <label>Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Property Type</option>
              <option value="Apartments">Apartment</option>
              <option value="Plots">Plot</option>
              <option value="Villas">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
              <option value="Lands">Land</option>
              <option value="PG">PG</option>
              <option value="Office">Office</option>
              <option value="Farm Lands">Farm Land</option>
            </select>
          </div>

          {/* Price Fields */}
          {form.alertType === "buyer" ? (
            <div className="price-range-container">
              <div className="form-group">
                <label>Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={form.minPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={form.maxPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Additional Notes */}
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Save Alert
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAlert;
