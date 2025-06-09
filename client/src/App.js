import React, { useEffect, useState } from "react";
import { checkHealth, getWelcomeMessage } from "./api/client";

function App() {
  const [message, setMessage] = useState("");
  const [health, setHealth] = useState("checking...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Проверка здоровья backend
        const healthResponse = await checkHealth();
        setHealth(healthResponse.status || "OK");

        // Получение приветственного сообщения
        const welcomeResponse = await getWelcomeMessage();
        setMessage(welcomeResponse.message || "Welcome to Dockerized App");
      } catch (err) {
        console.error("Backend connection error:", err);
        setError(err);
        setHealth("FAILED");
        setMessage("Cannot connect to backend");

        // Детализация ошибки для разработки
        if (process.env.NODE_ENV === "development") {
          setMessage(`Connection error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Dockerized React + Fastify</h1>
        <p>Connecting to backend...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dockerized React + Fastify</h1>
      <div>
        <strong>Backend Status:</strong> {health}
      </div>
      <div>
        <strong>API Response:</strong> {message}
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error details:</strong> {error.message}
          {process.env.NODE_ENV === "development" && (
            <div style={{ fontSize: "0.8em" }}>URL: {error.config?.url}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
