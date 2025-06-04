import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const UserCard = ({ user }) => {
  const { firstName, lastName, _id } = user;

  const sendRequest = async (status) => {
    const res = await axios.post(
      `${BASE_URL}/connectionRequest/send/${status}/${_id}`,
      {},
      { withCredentials: true }
    );
    console.log(res);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName}</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-error"
            onClick={() => sendRequest("ignored")}
          >
            Ignore
          </button>
          <button
            className="btn btn-info"
            onClick={() => sendRequest("interested")}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
