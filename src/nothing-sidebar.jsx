import React, { useState } from "react";
import "./SideBar.css";

const Sidebar = ({ events, currentDate, onDeleteEvent, onEditEvent }) => {
  // State to hold the selected category for filtering
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoryColors = {
    All: "#fff", // Default background color for "All"
    Personal: "#FFB6C1", // Light Pink for Personal
    Work: "#ADD8E6", // Light Blue for Work
    School: "#98FB98", // Light Green for School
    Other: "#D3D3D3", // Light Gray for Other
  };

  // Check if currentDate is valid
  const validDate = currentDate instanceof Date && !isNaN(currentDate);

  // If currentDate is invalid, use the current date as a fallback
  const dateToUse = validDate ? currentDate : new Date();

  // Get the current month and year
  const currentMonth = dateToUse.getMonth();
  const currentYear = dateToUse.getFullYear();

  // Filter events by date and category
  const filteredEvents = Object.entries(events)
    .flatMap(([date, eventsForDay]) =>
      eventsForDay.map((event) => ({
        ...event,
        date: new Date(date), // Convert the date string back to a Date object
      }))
    )
    .filter(
      (event) =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear &&
        (selectedCategory === "All" || event.eventCategory === selectedCategory)
    );

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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
      <ul>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const eventDate = event.date.toISOString().split("T")[0]; // Format the date

            return (
              <li
                key={`${eventDate}-${index}`}
                className="event-item"
                style={{
                  backgroundColor:
                    categoryColors[event.eventCategory] || categoryColors.All,
                }}
              >
                <div>
                  <h4>{event.eventName}</h4>
                  {event.eventDescription && <p>{event.eventDescription}</p>}
                  <p>
                    {event.eventStartTime} - {event.eventEndTime}
                  </p>
                  <p>Category: {event.eventCategory}</p>
                </div>
                <div className="event-actions">
                  {/* Delete button */}
                  <button onClick={() => onDeleteEvent(eventDate, index)}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const updatedName = prompt(
                        "Edit event name:",
                        event.eventName
                      );
                      if (updatedName) {
                        onEditEvent(eventDate, index, {
                          ...event,
                          eventName: updatedName,
                        });
                      }
                    }}
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
    </div>
  );
};

export default Sidebar;
