const vendor = require("../models/wat_vendorsData");

const saveVendorDetails = async (data) => {
  const { name, email, companyType, companyName, contact, address, location } =
    data;
  const isExisting = await vendor.findOne({ email: email });

  if (isExisting) {
    await vendor.updateOne(
      { email: email },
      {
        $set: {
          name: name,
          companyType: companyType,
          companyName: companyName,
          contact: contact,
          address: address,
          location: location,
        },
      }
    );
  } else if (!isExisting) {
    await vendor.create({
      name,
      email,
      companyType,
      companyName,
      contact,
      address,
      location,
    });
  }
};

module.exports = { saveVendorDetails };
