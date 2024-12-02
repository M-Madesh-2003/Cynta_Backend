const geolib = require('geolib');
const userLoc = require('../models/wat_userLocation');
const vendorLoc = require('../models/wat_vendorsData');

const saveUserLocationData = async (data) => {
  if (!data) {
    console.log('No data provided');
    return;
  }

  const { name, email, vendorType, location } = data;

  try {
    const existingEmail = await userLoc.findOne({ email });
    if (existingEmail) {
      await userLoc.findOneAndUpdate(
        { email },
        { $set: { name, location } }
      );
    } else {
      await userLoc.create({ name, email, location });
    }

    const vendors = await vendorLoc.find({ companyType: vendorType });

    const vendorsWithDistances = vendors.map(vendor => ({
      ...vendor._doc,
      distance: geolib.getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: vendor.location.latitude, longitude: vendor.location.longitude }
      ),
    }));

    vendorsWithDistances.sort((a, b) => a.distance - b.distance);

    const binarySearch = (maxDistance) => {
      let left = 0;
      let right = vendorsWithDistances.length - 1;
      let nearestIndex = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (vendorsWithDistances[mid].distance <= maxDistance) {
          nearestIndex = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      return vendorsWithDistances.slice(0, nearestIndex + 1);
    };

    let nearbyVendors = [];
    for (let maxDistance = 1000; maxDistance <= 10000; maxDistance += 1000) {
      nearbyVendors = binarySearch(maxDistance);
      if (nearbyVendors.length > 0) {
        break;
      }
    }

    return nearbyVendors;
  } catch (error) {
    console.error('Error saving user location data:', error);
  }
};

module.exports = { saveUserLocationData };
