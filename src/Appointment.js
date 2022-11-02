import React from "react";

export default function Appointment(model) {
  const { targetedAppointmentData } = model.data;
  let style = {};
  if (targetedAppointmentData.sourceType === "OCCUPANCY") {
    style = {
      backgroundColor: targetedAppointmentData.source.color
    };
  }

  return (
    <div className="showtime-preview" style={style}>
      <div>
        <strong>{model.data.targetedAppointmentData.sourceType}: </strong>
        <strong>{targetedAppointmentData.text}</strong> [ObjectId:{" "}
        {targetedAppointmentData.objectId}, UserId:{" "}
        {targetedAppointmentData.userId}]
      </div>
      <div>
        {new Intl.DateTimeFormat("de-DE", {
          hour: "numeric",
          minute: "numeric"
        }).format(targetedAppointmentData.displayStartDate)}

        {" - "}
        {new Intl.DateTimeFormat("de-DE", {
          hour: "numeric",
          minute: "numeric"
        }).format(targetedAppointmentData.displayEndDate)}
      </div>
    </div>
  );
}
