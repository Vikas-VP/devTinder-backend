const allowedFields = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "address",
  "city",
  "state",
  "zipCode",
  "skills",
];

const validateProfileEditData = (profileData) => {
  if (Object.keys(profileData).some((field) => allowedFields.includes(field))) {
    return true;
  } else {
    return false;
  }
};

module.exports = validateProfileEditData;
