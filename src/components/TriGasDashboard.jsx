import React, { useState, useEffect } from "react";
import "../App.css";

export default function TriGasDashboard() {
  const [o2, setO2] = useState(5.7);
  const [co2, setCO2] = useState(5.4);
  const [targetO2, setTargetO2] = useState(5.5);
  const [targetCO2, setTargetCO2] = useState(4.1);
  const [flash, setFlash] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSetpointO2, setShowSetpointO2] = useState(false);
  const [showSetpointCO2, setShowSetpointCO2] = useState(false);

  const [newTargetO2, setNewTargetO2] = useState(targetO2);
  const [newTargetCO2, setNewTargetCO2] = useState(targetCO2);

  const [showDeadbandModal, setShowDeadbandModal] = useState(false);
  const [deadbandCO2, setDeadbandCO2] = useState(0.3);
  const [deadbandO2, setDeadbandO2] = useState(0.2);

  const [showAlarmLimits, setShowAlarmLimits] = useState(false);
  const [minO2, setMinO2] = useState(4.0);
  const [maxO2, setMaxO2] = useState(7.0);
  const [minCO2, setMinCO2] = useState(3.0);
  const [maxCO2, setMaxCO2] = useState(7.0);

  const [fileName, setFileName] = useState("gas_data.csv");
  const [fileFormat, setFileFormat] = useState("csv");
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [logInterval, setLogInterval] = useState(5);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("admin"); // default password
  const [passwordMessage, setPasswordMessage] = useState("");


  useEffect(() => {
    const interval = setInterval(() => {
      setFlash((f) => !f);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isO2Alarm = Math.abs(o2 - targetO2) > 0.5;
  const isCO2Alarm = Math.abs(co2 - targetCO2) > 0.5;

  const getPanelClass = (alarm, base) => {
    return alarm && flash ? `${base} alarm` : base;
  };

  const handleSaveTargetCO2 = () => {
    setTargetCO2(newTargetCO2);
    setShowSetpointCO2(false);
  };

  const handleSaveTargetO2 = () => {
    setTargetO2(newTargetO2);
    setShowSetpointO2(false);
  };

  const handlePasswordSave = () => {
    if (currentPassword !== savedPassword) {
      setPasswordMessage("❌ Current password is incorrect.");
    } else if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ New passwords do not match.");
    } else {
      setSavedPassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("✅ Password updated successfully!");
    }
  };
  

  return (
    <div className="dashboard">
      <div className={getPanelClass(isCO2Alarm, "panel co2")}> 
        <h2>% Carbon Dioxide</h2>
        <p className="value" onClick={() => setShowSetpointCO2(true)}>{co2.toFixed(1)}</p>
        <p className="target">Target: {targetCO2.toFixed(1)}</p>
        <progress max="10" value={co2}></progress>
      </div>

      <div className={getPanelClass(isO2Alarm, "panel o2")}> 
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
        <h2>% Oxygen</h2>
        <p className="value" onClick={() => setShowSetpointO2(true)}>{o2.toFixed(1)}</p>
        <p className="target">Target: {targetO2.toFixed(1)}</p>
        <progress max="10" value={o2}></progress>
      </div>

      {menuOpen && (
        <div className="modal">
          <button onClick={() => setShowDeadbandModal(true)}>Control Deadband</button>
          <button onClick={() => setShowAlarmLimits(true)}>Alarm Limits</button>
          <button onClick={() => setShowFileMenu(true)}>Data File Menu</button>
          <button onClick={() => setShowPasswordModal(true)}>Password Setting</button>
        </div>
      )}

      {showSetpointCO2 && (
        <div className="modal">
          <h3>Set CO₂ Target</h3>
          <div className="adjust-row">
            <button onClick={() => setNewTargetCO2(prev => prev - 0.1)}>-</button>
            <span>{newTargetCO2.toFixed(1)}</span>
            <button onClick={() => setNewTargetCO2(prev => prev + 0.1)}>+</button>
          </div>
          <button onClick={handleSaveTargetCO2}>Save</button>
          <button onClick={() => setShowSetpointCO2(false)}>Close</button>
        </div>
      )}

      {showSetpointO2 && (
        <div className="modal">
          <h3>Set O₂ Target</h3>
          <div className="adjust-row">
            <button onClick={() => setNewTargetO2(prev => prev - 0.1)}>-</button>
            <span>{newTargetO2.toFixed(1)}</span>
            <button onClick={() => setNewTargetO2(prev => prev + 0.1)}>+</button>
          </div>
          <button onClick={handleSaveTargetO2}>Save</button>
          <button onClick={() => setShowSetpointO2(false)}>Close</button>
        </div>
      )}

      {showDeadbandModal && (
        <div className="modal">
          <h3>Control Deadband Settings</h3>
          <label>CO₂ Deadband: {deadbandCO2.toFixed(2)}
            <input type="range" min="0" max="2" step="0.1" value={deadbandCO2} onChange={(e) => setDeadbandCO2(parseFloat(e.target.value))} />
          </label>
          <label>O₂ Deadband: {deadbandO2.toFixed(2)}
            <input type="range" min="0" max="2" step="0.1" value={deadbandO2} onChange={(e) => setDeadbandO2(parseFloat(e.target.value))} />
          </label>
          <button onClick={() => setShowDeadbandModal(false)}>Close</button>
        </div>
      )}

      {showAlarmLimits && (
        <div className="modal centered">
          <h3>Alarm Limits</h3>
          <div className="modal-section">
            <label>O₂ Min</label>
            <input type="number" step="0.1" value={minO2} onChange={(e) => setMinO2(parseFloat(e.target.value))} />
            <label>O₂ Max</label>
            <input type="number" step="0.1" value={maxO2} onChange={(e) => setMaxO2(parseFloat(e.target.value))} />
          </div>
          <div className="modal-section">
            <label>CO₂ Min</label>
            <input type="number" step="0.1" value={minCO2} onChange={(e) => setMinCO2(parseFloat(e.target.value))} />
            <label>CO₂ Max</label>
            <input type="number" step="0.1" value={maxCO2} onChange={(e) => setMaxCO2(parseFloat(e.target.value))} />
          </div>
          <button className="modal-button" onClick={() => setShowAlarmLimits(false)}>Save</button>
          <button className="modal-button" onClick={() => setShowAlarmLimits(false)}>Close</button>
        </div>
      )}

      {showFileMenu && (
        <div className="modal centered">
          <h3>Data File Menu</h3>
          <div className="modal-section">
            <label>File Name</label>
            <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />

            <label>File Format</label>
            <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>

            <label>Logging Interval (min)</label>
            <input type="number" value={logInterval} onChange={(e) => setLogInterval(Number(e.target.value))} />

            <label>
              <input type="checkbox" checked={loggingEnabled} onChange={(e) => setLoggingEnabled(e.target.checked)} />
              Enable Logging
            </label>
          </div>
          <button className="modal-button" onClick={() => setShowFileMenu(false)}>Save</button>
          <button className="modal-button" onClick={() => setShowFileMenu(false)}>Close</button>
        </div>
      )}

{showPasswordModal && (
  <div className="modal centered">
    <h3>Password Setting</h3>

    <div className="modal-section">
      <label>Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <label>Confirm New Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>

    {passwordMessage && (
      <p style={{ color: passwordMessage.startsWith("✅") ? "green" : "red" }}>
        {passwordMessage}
      </p>
    )}

    <button className="modal-button" onClick={handlePasswordSave}>Save</button>
    <button className="modal-button" onClick={() => setShowPasswordModal(false)}>Close</button>
  </div>
)}


    </div>
  );
}
