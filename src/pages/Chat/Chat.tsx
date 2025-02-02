import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import deleteIcon from "../../assets/delete.png";
import "./Chat.scss";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";

const Chat = () => {
  const baseURL = `https://${process.env.REACT_APP_BASE_URL}/ws/chat`;

  // 채팅 메시지 상태 (닉네임과 텍스트를 저장)
  const [messages, setMessages] = useState<
    { user: string | null; text: string }[]
  >([]);
  const [input, setInput] = useState(""); // 입력 필드 상태
  const stompClientRef = useRef<any>(null);

  const authHeader = window.localStorage.getItem("token") || "";
  const userNickname = localStorage.getItem("name");

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(baseURL),
      connectHeaders: {
        Authorization: authHeader,
      } as { Authorization: string },

      onConnect: () => {
        console.log("WebSocket open");
        // 채팅 구독
        client.subscribe("/subscribe/chat/room/testStudy", (message) => {
          if (message.body) {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMessage]);
          }
        });
        stompClientRef.current = client;
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },

      onStompError: (error) => {
        console.error("WebSocket 연결 실패:", error);
      },
    });

    client.activate();
  }, []);

  const sendMessage = () => {
    console.log(userNickname);
    if (input.trim() && stompClientRef !== null) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // UTC -> Local 변환
      const formattedTimestamp = now.toISOString().split(".")[0];

      const message = {
        studyName: "testStudy",
        sender: userNickname,
        message: input,
        timestamp: formattedTimestamp, // 한국 시간 반영, 형식 일치 확인
      };

      console.log("message 형식 => ", message);
      console.log("send 보낼 때 stompClient => ", stompClientRef);

      stompClientRef.current.publish({
        destination: "/publish/room",
        headers: {},
        body: JSON.stringify(message),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: userNickname, text: input },
      ]);
      setInput("");
    } else {
    }
  };

  // Enter 키를 눌렀을 때 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const navigate = useNavigate();
  const handleExit = () => {
    navigate("/study");
  };

  return (
    <div className="chat-container">
      <div className="chat-ground">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.user === userNickname ? "my-message" : "other-message"
              }`}
            >
              <span className="nickname">{msg.user}</span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <footer className="chat-footer">
          <input
            type="text"
            placeholder="채팅을 입력해주세요."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>보내기</button>
        </footer>
      </div>
      <button className="deleteIcon" onClick={handleExit}>
        <img src={deleteIcon} alt="delete" className="delete-image" />
      </button>
    </div>
  );
};

export default Chat;
