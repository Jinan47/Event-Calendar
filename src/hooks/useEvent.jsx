import { useState, useEffect } from "react";

const useEvents = (events, selectedCategory, currentMonth, currentYear) => {
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const filtered = Object.entries(events)
      .flatMap(([date, eventsForDay]) => {
        if (Array.isArray(eventsForDay)) {
          return eventsForDay.map((event) => ({
            ...event,
            date: new Date(date),
          }));
        }
        return [];
      })
      .filter(
        (event) =>
          event.date.getMonth() === currentMonth &&
          event.date.getFullYear() === currentYear &&
          (selectedCategory === "All" || event.eventCategory === selectedCategory)
      );
    setFilteredEvents(filtered);
  }, [events, selectedCategory, currentMonth, currentYear]);

  return filteredEvents;
};

export default useEvents;
