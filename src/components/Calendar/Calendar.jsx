import React, { useState, useEffect } from "react";
import { getDaysInMonth, getDay, startOfMonth } from "date-fns";
import "./Calendar.css";

const Calendar = ({
  currentDate,
  setCurrentDate,
  handleAddEvent,
  selectedCategory,
  setSelectedCategory,
  events,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [hoveredDate, setHoveredDate] = useState(null);
  const [editingEventName, setEditingEventName] = useState(null);

    // Function to start editing an event
    const handleEditEvent = (eventName) => {
      // Find the event being edited
      const eventToEdit = events.flatMap((dayEvents) =>
        dayEvents.filter((event) => event.eventName === eventName)
      )[0];
  
      if (eventToEdit) {
        setNewEvent(eventToEdit.eventName);
        setEventDescription(eventToEdit.eventDescription || "");
        setSelectedCategory(eventToEdit.eventCategory);
        setEventStartTime(eventToEdit.eventStartTime);
        setEventEndTime(eventToEdit.eventEndTime);
        setEditingEventName(eventName);  // Set the editing state
      }
    };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      return nextMonth;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
      return prevMonth;
    });
  };

  const handleDayClick = (day) => setSelectedDate(day);

  const today = new Date();

  const isToday = (day) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate.getDate() === today.getDate() && dayDate.getMonth() === today.getMonth() && dayDate.getFullYear() === today.getFullYear();
  };

  const handleSubmitEvent = () => {
    if (newEvent.trim()) {
      handleAddEvent(
        selectedDate.toDateString(),
        newEvent,
        eventDescription,
        eventStartTime,
        eventEndTime,
        selectedCategory,
        "Personal"
      );
      setNewEvent("");
      setEventDescription("");
      setEventStartTime("");
      setEventEndTime("");
      setSelectedDate(null);
      setSelectedCategory("Personal");
    }
    else if (editingEventId) {
      // If we're editing an event, update it
      const updatedEvents = events.map((dayEvents) =>
        dayEvents.map((event) =>
          event.eventId === editingEventId
            ? {
                ...event,
                eventName: newEvent,
                eventDescription,
                eventCategory: selectedCategory,
                eventStartTime,
                eventEndTime,
              }
            : event
        )
      );
      setEvents(updatedEvents);
      setEditingEventName(null);  // Clear the editing state
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate));

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const days = [
    ...Array(startDay === 0 ? 6 : startDay - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Get events for the hovered date
  const getEventsForHoveredDate = () => {
    const hoveredDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), hoveredDate).toDateString();
    return events[hoveredDateStr] || [];
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Event Calendar</h2>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <span className="month-name">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button onClick={handleNextMonth}>{">"}</button>
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
              day && handleDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
            }
            onMouseEnter={() => setHoveredDate(day)}
            onMouseLeave={() => setHoveredDate(null)}
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
            placeholder="Description (optional)"
          />
          <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Other">Other</option>
          </select>
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
          <button onClick={handleSubmitEvent}>Add Event</button>
          <button onClick={() => setSelectedDate(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
