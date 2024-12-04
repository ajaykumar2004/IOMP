import React, { useState, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generativeai";

const Chat = ({ stress, remedy, apiKey }) => {
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); // To show a loading indicator
  const [response, setResponse] = useState(""); // Store response from API

  console.log("stress", stress);

  useEffect(() => {
    // Add the initial bot message when the component mounts
    console.log(remedy);
    setChatHistory([{ type: "bot", text: remedy }]);
    console.log(chatHistory);
  }, [remedy]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSend = async () => {
    var chatAndInput = chatHistory.map((message) => message.text).join(" ") + " " + inputValue;
    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt:  chatAndInput }), // Wrap inputValue in an object with a prompt key
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await res.json();

      setChatHistory((prev) => [...prev, { type: "user", text:inputValue }]);
      setChatHistory((prev) => [...prev, { type: "bot", text: data.response }]);
      setResponse(data.response);
      console.log(data.response );
    } catch (err) {
      console.error(err.message);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          text: "There was an error processing your request. Please try again.",
        },
      ]);
    }

    finally{
      setLoading(false); // Set loading to false after API call finishes
      setInputValue(""); // Clear the input field
    }
  };

  //
  // const handleSend = async () => {
  //   if (inputValue.trim()) {
  //     setChatHistory((prev) => [...prev, { type: "user", text: inputValue }]);
  //     setLoading(true); // Set loading to true when API call starts

  //     // const model = new GoogleGenerativeAI({ apiKey: process.env.REACT_APP_API_KEY });

  //     try {
  //       // Sending the question to Gemini AI API (using GoogleGenerativeAI SDK)
  //       // const apiResponse = await model.generateText(inputValue); // Adjust according to actual API method

  //       // Handle the response and update chat history
  //       const botResponse = apiResponse.text || "Sorry, I couldn't process that.";
  //       setChatHistory((prev) => [...prev, { type: "bot", text: botResponse }]);
  //       setResponse(apiResponse.text); // Update the response state
  //     } catch (error) {
  //       console.error("Error communicating with the API:", error);
  //       setChatHistory((prev) => [
  //         ...prev,
  //         { type: "bot", text: "There was an error processing your request. Please try again." },
  //       ]);
  //     } finally {
  //       setLoading(false); // Set loading to false after API call finishes
  //       setInputValue(""); // Clear the input field
  //     }
  //   }
  // };

  const splitPoints = (text) => {
    const regex = /^\d\.\s.*$/gm; // Matches lines starting with a number followed by a period
    return text.match(regex) || []; // Returns an array of points or an empty array if no match
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "60%",
        margin: "auto",
        marginTop: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        padding: "15px",
      }}
    >
        <div>
            <h1 style={{ textAlign: "center", padding: "10px" }}>
                Stress level (0-5) : {stress}
            </h1>
        </div>

      {/* Chat History */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "15px",
                backgroundColor:
                  message.type === "user" ? "#d1e7dd" : "#e9ecef",
                color: "#333",
                textAlign: "left",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {message.type === "bot" ? (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    listStyleType: "decimal",
                  }}
                >
                  <li>{message.text}</li>
                  {/* {splitPoints(message.text).map((point, i) => (
                    <li key={i}>{point.replace(/^\d\.\s/, "").trim()}</li>
                  ))} */}
                </ul>
              ) : (
                <p style={{ margin: 0 }}>{message.text}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{ textAlign: "center", color: "#888", marginTop: "10px" }}
          >
            Loading...
          </div>
        )}
      </div>

      {/* Input Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          style={{
            flex: 1,
            border: "2px solid #ddd",
            height: "40px",
            borderRadius: "4px",
            padding: "5px",
          }}
          type="text"
          placeholder="Enter your message"
          onChange={handleChange}
          value={inputValue}
        />
        <button
          style={{
            marginLeft: "10px",
            width: "80px",
            height: "40px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSend}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;