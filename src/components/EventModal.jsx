import React, { useState } from 'react';

const EventModal = ({ isOpen, onClose, onSave, event }) => {
  const [eventName, setEventName] = useState(event?.name || '');
  const [startTime, setStartTime] = useState(event?.startTime || '');
  const [endTime, setEndTime] = useState(event?.endTime || '');
  const [description, setDescription] = useState(event?.description || '');

  const handleSubmit = () => {
    onSave({ eventName, startTime, endTime, description });
    onClose();
  };

  return (
    isOpen && (
      <div className="modal">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
        />
        <input
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={handleSubmit}>Save Event</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    )
  );
};

export default EventModal;
