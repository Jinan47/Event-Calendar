const EventList = ({ events }) => {
    return (
      <div className="event-list">
        {events.map((event, index) => (
          <div key={index}>
            <h4>{event.name}</h4>
            <p>{event.startTime} - {event.endTime}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    );
  };
  