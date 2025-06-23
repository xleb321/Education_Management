import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDirectionDetails } from "@api/faculties";

const DirectionPage = () => {
  const { id } = useParams();
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDirection = async () => {
      try {
        const data = await getDirectionDetails(id);
        setDirection(data);
      } catch (error) {
        console.error("Error loading direction:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDirection();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!direction) return <div>Direction not found</div>;

  return (
    <div>
      <h1>
        {direction.code} {direction.name}
      </h1>
      <p>Faculty: {direction.faculty_name}</p>
      <p>{direction.description}</p>

      <h2>Groups</h2>
      <ul>
        {direction.groups?.map((group) => (
          <li key={group.id}>
            {group.name} ({group.start_year}-{group.end_year})
          </li>
        ))}
      </ul>
    </div>
  );
};
