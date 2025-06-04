import axios from "axios";
import { UserCard } from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../store/slices/feedSlice";

export const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchFeed();
  }, []);
  console.log(feed, "store");
  return (
    <div className="flex justify-center my-5">
      {feed && <UserCard user={feed?.[1]} />}
    </div>
  );
};
