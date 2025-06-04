import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { Link } from "react-router";
import { useParams } from "react-router";

export const Connections = () => {
  const [connections, setConnections] = useState([]);

  const fetchConnections = () => {
    axios
      .get(`${BASE_URL}/connections`, { withCredentials: true })
      .then((data) => setConnections(data?.data?.data));
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="card w-96 bg-base-100 card-sm shadow-sm flex justify-center">
      {connections?.map((item) => {
        return (
          <div className="card-body">
            <h2 className="card-title">{item?.firstName}</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="justify-end card-actions">
              <Link to={`/chat/${item?._id}`}>
                <button className="btn btn-primary">Chat</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
