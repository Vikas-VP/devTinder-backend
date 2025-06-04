import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser } from "../store/slices/userSlice";

export const Profile = () => {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [user, setUser] = useState({ ...userInfo });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    const res = await axios.patch(
      `${BASE_URL}/profile/edit`,
      { firstName: user.firstName, lastName: user.lastName },
      { withCredentials: true }
    );
    console.log(res, "update");
    dispatch(addUser(res?.data?.data));
  };

  return (
    <div className=" flex justify-center my-10 flex-row">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Profile details</legend>

        <label className="label">First Name</label>
        <input
          type="text"
          className="input"
          placeholder="My awesome page"
          value={user?.firstName}
          name={"firstName"}
          onChange={handleChange}
        />

        <label className="label">Last Name</label>
        <input
          type="text"
          className="input"
          placeholder="my-awesome-page"
          value={user?.lastName}
          name={"lastName"}
          onChange={handleChange}
        />

        {/* <label className="label">Author</label>
        <input type="text" className="input" placeholder="Name" /> */}
        <button className="btn btn-neutral mt-4" onClick={updateProfile}>
          Save Profile
        </button>
      </fieldset>
    </div>
  );
};
