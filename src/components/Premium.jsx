import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const handleBuyClick = async (membershipType) => {
    const res = await axios.post(
      `${BASE_URL}/payment/create`,
      { membershipType },
      {
        withCredentials: true,
      }
    );
    const {
      keyId,
      _doc: { amount, currency, notes, orderId },
    } = res?.data?.data;
    console.log(res?.data?.data, "data");
    var options = {
      key: keyId, // Enter the Key ID generated from the Dashboard
      amount,
      currency,
      notes,
      orderId,
      name: "Vikas App",
      description: "This is payment gateway",
      prefill: {
        firstName: notes?.firstName,
        contact: +919900000000,
      },
    };
    console.log(options, "options");
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="flex w-full m-10">
      <div className="card bg-base-300 rounded-box grid h-20 grow place-items-center">
        Silver
        <button
          className="btn btn-secondary"
          onClick={() => handleBuyClick("SILVER")}
        >
          Silver
        </button>
      </div>
      <div className="divider divider-horizontal">OR</div>
      <div className="card bg-base-300 rounded-box grid h-20 grow place-items-center">
        Gold
        <button
          className=" btn btn-primary"
          onClick={() => handleBuyClick("GOLD")}
        >
          Gold
        </button>
      </div>
    </div>
  );
};

export default Premium;
