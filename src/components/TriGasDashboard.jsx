import React, { useState, useEffect } from "react";
import "../App.css";

export default function TriGasDashboard() {
  const [o2, setO2] = useState(5.7);
  const [co2, setCO2] = useState(5.4);
  const [targetO2, setTargetO2] = useState(5.5);
  const [targetCO2, setTargetCO2] = useState(4.1);
  const [flash, setFlash] = useState(false);

  const [newTargetO2, setNewTargetO2] = useState(targetO2);
  const [newTargetCO2, setNewTargetCO2] = useState(targetCO2);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSetpointO2, setShowSetpointO2] = useState(false);
  const [showSetpointCO2, setShowSetpointCO2] = useState(false);

  useEffect(() => {
    const flashInterval = setInterval(() => {
      setFlash((f) => !f);
    }, 1000);
    return () => clearInterval(flashInterval);
  }, []);

  useEffect(() => {
    fetch("/api/setpoints")
      .then((res) => res.json())
      .then((data) => {
        if (data.o2) {
          setTargetO2(data.o2);
          setNewTargetO2(data.o2);
        }
        if (data.co2) {
          setTargetCO2(data.co2);
          setNewTargetCO2(data.co2);
        }
      })
      .catch((err) => console.error("Error loading setpoints:", err));
  }, []);

  const handleSaveTargetO2 = async () => {
    try {
      const response = await fetch("/api/setpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ o2: parseFloat(newTargetO2) }),
      });
      if (response.ok) {
        setTargetO2(parseFloat(newTargetO2));
        setShowSetpointO2(false);
      }
    } catch (error) {
      console.error("Error saving O2 target:", error);
    }
  };

  const handleSaveTargetCO2 = async () => {
    try {
      const response = await fetch("/api/setpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ co2: parseFloat(newTargetCO2) }),
      });
      if (response.ok) {
        setTargetCO2(parseFloat(newTargetCO2));
        setShowSetpointCO2(false);
      }
    } catch (error) {
      console.error("Error saving CO2 target:", error);
    }
  };

  const isO2Alarm = Math.abs(o2 - targetO2) > 0.5;
  const isCO2Alarm = Math.abs(co2 - targetCO2) > 0.5;

  const getPanelClass = (alarm, base) => {
    if (!alarm) return base;
    return flash ? `${base} alarm` : base;
  };

  return (
    <div className="dashboard">
      {/* CO2 PANEL */}
      <div className={getPanelClass(isCO2Alarm, "panel co2")}>
        <h2>% Carbon Dioxide</h2>
        <p className="value" onClick={() => setShowSetpointCO2(true)}>
          {co2.toFixed(1)}
        </p>
        <p className="target">Target: {targetCO2}</p>
        <progress max="10" value={co2}></progress>
      </div>

      {/* O2 PANEL */}
      <div className={getPanelClass(isO2Alarm, "panel o2")}>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h2>% Oxygen</h2>
        <p className="value" onClick={() => setShowSetpointO2(true)}>
          {o2.toFixed(1)}
        </p>
        <p className="target">Target: {targetO2}</p>
        <progress max="10" value={o2}></progress>
      </div>

      {/* MENU POPUP */}
      {menuOpen && (
        <div className="modal">
          <button>Control Deadband</button>
          <button>Alarm Limits</button>
          <button>Data File Menu</button>
          <button>Password Setting</button>
        </div>
      )}

      {/* Setpoint CO2 Modal */}
      {showSetpointCO2 && (
        <div className="modal">
          <h3>Set CO₂ Target</h3>
          <input
            type="number"
            value={newTargetCO2}
            onChange={(e) => setNewTargetCO2(e.target.value)}
            step="0.1"
          />
          <button onClick={handleSaveTargetCO2}>Save</button>
          <button onClick={() => setShowSetpointCO2(false)}>Close</button>
        </div>
      )}

      {/* Setpoint O2 Modal */}
      {showSetpointO2 && (
        <div className="modal">
          <h3>Set O₂ Target</h3>
          <input
            type="number"
            value={newTargetO2}
            onChange={(e) => setNewTargetO2(e.target.value)}
            step="0.1"
          />
          <button onClick={handleSaveTargetO2}>Save</button>
          <button onClick={() => setShowSetpointO2(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
