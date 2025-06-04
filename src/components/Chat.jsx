import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { createSocketConnection } from "../utils/Socket";
import { useSelector } from "react-redux";

export const Chat = () => {
  const { targetUserId } = useParams();
  const [inputTxt, setInputTxt] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((store) => store.user);
  const fromUserId = user?._id;
  const userName = user?.firstName;
  console.log(targetUserId, "targetUserId", user);

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    console.log(userName, fromUserId, targetUserId);
    socket.emit("joinChat", { userName, fromUserId, targetUserId });
    socket.on(
      "messageRecived",
      ({ userName, fromUserId, targetUserId, message }) => {
        console.log(userName, message, "msg");
        setMessages((msg) => [...msg, { userName, message }]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [user, targetUserId]);

  console.log(messages, "messages");

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      userName,
      fromUserId,
      targetUserId,
      message: inputTxt,
    });
    setInputTxt("");
  };

  return (
    <div>
      <input value={inputTxt} onChange={(e) => setInputTxt(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
