import React, { useState, useEffect } from "react";

const CategoryFetcher = ({ onCategoriesLoaded }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://backend.edirect.ng/api/list/business/category",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        // Extract the 'categories' array from the 'data' property
        const fetchedCategories = data.data.categories || [];
        setCategories(fetchedCategories);
        if (onCategoriesLoaded) {
          onCategoriesLoaded(fetchedCategories);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onCategoriesLoaded]);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return null;
};

export default CategoryFetcher;
