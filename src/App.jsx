import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar/Calendar.jsx";
import Sidebar from "./components/SideBar/SideBar.jsx";

const App = () => {
  // State to track the current date, events, selected category, and hovered date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [hoveredDate, setHoveredDate] = useState(null);

  // Add event to the events state and save it to localStorage
  const handleAddEvent = (
    date,
    eventName,
    eventDescription,
    eventStartTime,
    eventEndTime,
    eventCategory,
    eventId
  ) => {
    setEvents((prevEvents) => {
      const updatedEvents = {
        ...prevEvents,
        [date]: [
          ...(prevEvents[date] || []),
          {
            eventName,
            eventDescription,
            eventStartTime,
            eventEndTime,
            eventCategory,
            eventId,
          },
        ],
      };
      localStorage.setItem("events", JSON.stringify(updatedEvents)); // Persist updated events to localStorage
      return updatedEvents;
    });
  };

  const handleDeleteEvent = (eventName) => {
    console.log("Event Name to delete:", eventName);
    const updatedEvents = Object.keys(events).reduce((acc, date) => {
      const dayEvents = events[date]; // Get events for this date
      if (Array.isArray(dayEvents)) {
        const filteredEvents = dayEvents.filter(
          (event) => event.eventName !== eventName
        );
        if (filteredEvents.length > 0) {
          acc[date] = filteredEvents;
        }
      } else {
        console.warn(`Skipping invalid data for date: ${date}`, dayEvents);
      }
      return acc;
    }, {});

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents)); // Persist updated events to localStorage
  };

  const handleEditEvent = (
    oldEventName,
    newEventName,
    newEventDescription,
    newEventStartTime,
    newEventEndTime,
    newEventCategory,
    eventId
  ) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      // Find and update the event based on the old event name
      Object.keys(updatedEvents).forEach((date) => {
        updatedEvents[date] = updatedEvents[date].map((event) =>
          event.eventName === oldEventName
            ? {
                ...event,
                eventName: newEventName,
                eventDescription: newEventDescription,
                eventStartTime: newEventStartTime,
                eventEndTime: newEventEndTime,
                eventCategory: newEventCategory,
              }
            : event
        );
      });
      localStorage.setItem("events", JSON.stringify(updatedEvents)); // Persist updated events to localStorage
      return updatedEvents;
    });
  };

  // Load saved events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) setEvents(JSON.parse(savedEvents)); // Parse and set saved events
  }, []);

  // Persist events to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(events).length)
      localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="app-container">
      {/* Calendar section */}
      <div className="calendar-container">
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          handleAddEvent={handleAddEvent}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          events={events}
          setHoveredDate={setHoveredDate}
        />
      </div>

      {/* Sidebar section */}
      <div className="sidebar-container">
        <Sidebar
          events={events}
          hoveredDate={hoveredDate}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          currentDate={currentDate}
          handleDeleteEvent={handleDeleteEvent}
          handleEditEvent={handleEditEvent}
        />
      </div>
    </div>
  );
};

export default App;
