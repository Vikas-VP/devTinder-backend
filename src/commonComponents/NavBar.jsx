import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../store/slices/userSlice";

export const NavBar = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const logoutRes = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    if (logoutRes.data.status === "OK") {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-cyan-900 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          💑 DevTinder
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        Welcome {userInfo?.firstName}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to={"/profile"}>
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li onClick={handleLogout}>
              <button>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
