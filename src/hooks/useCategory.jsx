import { useState } from "react";

const useCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  return {
    selectedCategory,
    handleCategoryChange,
  };
};

export default useCategory;
