import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🔹 Fetch Events from Drupal API
  useEffect(() => {
    axios
      .get("http://celebrio.ddev.site/api/event") // <--- HERE is your API URL
      .then((res) => {
        const payload = res?.data ?? {};
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];
        console.log("Fetched events (normalized)", items);
        setEvents(items);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Check if an event exists on a date
  const getEventForDate = (date) => {
    const formatDateLocal = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const selected = formatDateLocal(date);
    return events.find((event) => event.attributes.field_date === selected);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Drupal Events Calendar</h1>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) =>
          getEventForDate(date) ? <span>📌</span> : null
        }
      />

      {/* Show events for selected date */}
      <h2>Events on {selectedDate.toDateString()}</h2>
      <ul>
        {events
          .filter(
            (event) => {
              const formatDateLocal = (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              };
              return (
                event.attributes.field_date === formatDateLocal(selectedDate)
              );
            }
          )
          .map((event) => (
            <li key={event.id}>
              <strong>{event.attributes.title}</strong> <br />
              📍 {event.attributes.field_location} <br />
              📅 {event.attributes.field_date}
            </li>
          ))}
      </ul>

      {/* Show all events */}
     
    </div>
  );
}

export default App;
