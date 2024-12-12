import React, { useState, useEffect } from "react";
import Calendar from "./nothing-sidebar.jsx";
import Sidebar from "./nothing-calendar.jsx";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Personal"); // Added selectedCategory to state

  // Wrapper for updating current month
  const updateCurrentMonth = (newDate) => {
    console.log("Updating current month to:", newDate);
    setCurrentMonth(newDate);
  };

  // Load events from localStorage when the app initializes
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they are updated
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const handleAddEvent = (
    date,
    eventName,
    eventDescription,
    eventStartTime,
    eventEndTime,
    eventCategory
  ) => {
    setEvents((prevEvents) => {
      const updatedEvents = {
        ...prevEvents,
        [date]: [
          ...(prevEvents[date] || []),
          { eventName, eventDescription, eventStartTime, eventEndTime, eventCategory },
        ],
      };

      // Save to localStorage after updating the events
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  return (
    <div className="app">
      <Sidebar
        events={events}
        currentMonth={currentMonth}
        hoveredDay={hoveredDay}
        selectedCategory={selectedCategory} // Pass selectedCategory to Sidebar
        setSelectedCategory={setSelectedCategory} // Pass setSelectedCategory to Sidebar
      />
      <Calendar
        currentDate={currentMonth}
        setCurrentDate={updateCurrentMonth} // Use the wrapper function here
        handleAddEvent={handleAddEvent}
        setHoveredDay={setHoveredDay}
        selectedCategory={selectedCategory} // Pass selectedCategory to Calendar
        setSelectedCategory={setSelectedCategory} // Pass setSelectedCategory to Calendar
      />
    </div>
  );
};

export default App;
