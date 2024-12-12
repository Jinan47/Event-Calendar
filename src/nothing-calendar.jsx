import React, { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
} from "date-fns";

const Calendar = ({
  handleAddEvent,
  setHoveredDay,
  setSelectedCategory,
  selectedCategory,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Add state for currentDate
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  useEffect(() => {
    console.log("Calendar received currentDate:", currentDate);
  }, [currentDate]);
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      return nextMonth;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      return prevMonth;
    });
  };
  const handleDayClick = (day) => setSelectedDate(day);

  const today = new Date(); // Get today's date

  // Check if the day is today's date
  const isToday = (day) => {
    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return (
      dayDate.getDate() === today.getDate() &&
      dayDate.getMonth() === today.getMonth() &&
      dayDate.getFullYear() === today.getFullYear()
    );
  };

  const handleSubmitEvent = () => {
    if (newEvent.trim()) {
      handleAddEvent(
        selectedDate.toDateString(),
        newEvent,
        eventDescription,
        eventStartTime,
        eventEndTime,
        selectedCategory
      );
      setNewEvent("");
      setEventDescription("");
      setEventStartTime("");
      setEventEndTime("");
      setSelectedDate(null);
      setSelectedCategory("Personal");
    }
  };

  const handleMouseEnter = (day) => {
    if (day) {
      setHoveredDay(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).toDateString()
      );
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate));

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = [
    ...Array(startDay === 0 ? 6 : startDay - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Event Calendar</h2>
      <div className="calendar-header">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
        >
          {"<"}
        </button>
        <span className="month-name">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
        >
          {">"}
        </button>
      </div>
      <div className="calendar-grid">
        {dayNames.map((dayName) => (
          <div key={dayName} className="day-name">
            {dayName}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day ? (isToday(day) ? "today" : "") : "empty-day"
            }`}
            onClick={() =>
              day &&
              handleDayClick(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              )
            }
            onMouseEnter={() => handleMouseEnter(day)}
            onMouseLeave={handleMouseLeave}
          >
            {day || ""}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="event-form">
          <h3>Add Event for {selectedDate.toDateString()}</h3>
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Event Name"
          />
          <input
            type="text"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Description(optional)"
          />
          <input
            type="time"
            value={eventStartTime}
            onChange={(e) => setEventStartTime(e.target.value)}
          />
          <input
            type="time"
            value={eventEndTime}
            onChange={(e) => setEventEndTime(e.target.value)}
          />
          <br />
          <select
            name="category"
            id="category"
            value={selectedCategory} // Using the prop instead of local state
            onChange={(e) => setSelectedCategory(e.target.value)} // Update via the parent
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleSubmitEvent}>Add Event</button>
          <button onClick={() => setSelectedDate(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
