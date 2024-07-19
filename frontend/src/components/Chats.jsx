import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField } from "@mui/material";

const generateColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `#${((hash & 0x00ffffff) >>> 0).toString(16).padStart(6, "0")}`;
  return color;
};

const generateRandomMessage = (players) => {
  const messages = [
    "Hello there!",
    "How's it going?",
    "Nice to meet you!",
    "What's up?",
    "Have a great day!",
  ];

  if (players?.length === 0) {
    return { text: "No players available.", color: "#FFFFFF" };
  } else if (players && players?.length > 0) {
    const player = players[Math.floor(Math.random() * players?.length)];
    const color = generateColor(player.name);

    return {
      text: `${player.name}: ${
        messages[Math.floor(Math.random() * messages.length)]
      }`,
      color,
    };
  }
};

export const Chats = ({ players }) => {
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You: ${input}`, type: "You" },
      ]);
      setInput("");
    }
  };

  useEffect(() => {
    if (players && players?.length > 0) {
      const interval = setInterval(() => {
        const { text, color } = generateRandomMessage(players);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text, type: "random", color },
        ]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [players]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <Box
      padding="10px"
      borderRadius=".3pc"
      boxShadow="0 0 3px 0px #636467"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      maxHeight="13.5pc"
    >
      <Box height="100%" className="chatBox overflow-y-auto">
        {messages.map((message, index) => (
          <Box
            key={index}
            style={{
              textAlign: message.type === "You" ? "right" : "left",
              padding: "5px",
              color:
                message.type === "You" ? "#f1cdbe" : message.color || "#fff",
              borderRadius: "5px",
              marginBottom: "5px",
            }}
          >
            {message.text}
          </Box>
        ))}
        <Box ref={chatEndRef} />
      </Box>
      <Box display="flex" gap={2}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "100%", color: "#fff" }}
          className="playerNameInput"
        />
        <Button
          type="submit"
          color="warning"
          variant="outlined"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
