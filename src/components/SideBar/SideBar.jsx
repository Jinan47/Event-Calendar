import React, { useState } from "react";
import "./SideBar.css";
import "../Calendar/Calendar.jsx";

const SideBar = ({
  events,
  currentDate,
  handleDeleteEvent,
  handleEditEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingEvent, setEditingEvent] = useState(null); // Track the event being edited
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventData, setNewEventData] = useState({
    eventName: "",
    eventDescription: "",
    eventStartTime: "",
    eventEndTime: "",
    eventCategory: selectedCategory,
  });

  // Define colors for each category
  const categoryColors = {
    Personal: "#FFB6C1",
    Work: "#ADD8E6",
    School: "#98FB98",
    Other: "#D3D3D3",
  };

  // Ensure the provided currentDate is valid
  const dateToUse =
    currentDate instanceof Date && !isNaN(currentDate)
      ? currentDate
      : new Date();
  const currentMonth = dateToUse.getMonth();
  const currentYear = dateToUse.getFullYear();

  // Safely access events and ensure eventsForDay is always an array
  const filteredEvents = Object.entries(events)
    .flatMap(([date, eventsForDay]) => {
      // Check if eventsForDay is an array before mapping
      if (Array.isArray(eventsForDay)) {
        return eventsForDay.map((event) => ({
          ...event,
          date: new Date(date),
        }));
      }
      return []; // Return an empty array if eventsForDay is not an array
    })
    .filter(
      (event) =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear &&
        (selectedCategory === "All" || event.eventCategory === selectedCategory)
    );

  // Handle category change
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // Handle edit form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle event editing
  const handleEditClick = (event) => {
    setEditingEvent(event);
    setNewEventData({
      eventName: event.eventName,
      eventDescription: event.eventDescription,
      eventStartTime: event.eventStartTime,
      eventEndTime: event.eventEndTime,
      eventCategory: event.eventCategory,
    });
  };

  // Handle save for edited event
  const handleSaveEdit = () => {
    handleEditEvent(
      editingEvent.eventName, // The old event name to identify which event to edit
      newEventData.eventName,
      newEventData.eventDescription,
      newEventData.eventStartTime,
      newEventData.eventEndTime,
      newEventData.eventCategory
    );
    setEditingEvent(null);
    setNewEventData({
      eventName: "",
      eventDescription: "",
      eventStartTime: "",
      eventEndTime: "",
      eventCategory: selectedCategory,
    });
  };

  return (
    <div className="sidebar">
      <h3>
        Events for{" "}
        {dateToUse.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      {/* Category filter dropdown */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="category-filter"
      >
        <option value="All">All Categories</option>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="School">School</option>
        <option value="Other">Other</option>
      </select>

      {/* List filtered events */}
      <ul>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const dayOfWeek = event.date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const formattedDate = event.date.toLocaleDateString("en-US", {
              day: "numeric",
            });

            return (
              <li
                key={`${event.date.toISOString()}-${index}`}
                className="event-item"
                style={{
                  backgroundColor:
                    categoryColors[event.eventCategory] || categoryColors.All,
                }}
              >
                <h4>{event.eventName}</h4>
                {event.eventDescription && (
                  <p className="description">{event.eventDescription}</p>
                )}
                <p>
                  Day: {dayOfWeek}, {formattedDate}
                </p>
                {event.eventStartTime && (
                  <p className="time">From {event.eventStartTime}</p>
                )}{" "}
                {event.eventEndTime && (
                  <p className="time">To {event.eventEndTime}</p>
                )}
                <p>Category: {event.eventCategory}</p>
                <div className="action-button-div">
                  <button
                    className="action-button"
                    onClick={() => handleDeleteEvent(event.eventName)}
                  >
                    Delete
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleEditClick(event)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <p>No events available for this category.</p>
        )}
      </ul>

      {/* Edit event form */}
      {editingEvent && (
        <div className="edit-event-form">
          <h3>Edit Event</h3>
          <input
            type="text"
            name="eventName"
            value={newEventData.eventName}
            onChange={handleInputChange}
            placeholder="Event Name"
          />
          <input
            name="eventDescription"
            value={newEventData.eventDescription}
            onChange={handleInputChange}
            placeholder="Event Description"
          />
          <input
            type="time"
            name="eventStartTime"
            value={newEventData.eventStartTime}
            onChange={handleInputChange}
            placeholder="Start Time"
          />
          <input
            type="time"
            name="eventEndTime"
            value={newEventData.eventEndTime}
            onChange={handleInputChange}
            placeholder="End Time"
          />
          <select
            name="eventCategory"
            value={newEventData.eventCategory}
            onChange={handleInputChange}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleSaveEdit}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
