import { useState } from "react";

const useForm = (initialData, onSave) => {
  const [newEventData, setNewEventData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    onSave(newEventData);
    setNewEventData(initialData); // Reset form after save
  };

  return {
    newEventData,
    handleInputChange,
    handleSaveEdit,
  };
};

export default useForm;
