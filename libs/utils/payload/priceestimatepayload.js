const errandlr = (order) => {
  const payload = {
    dropoffLocations: [
      {
        id: `${order.pickup_longitude},${order.pickup_latitude}`,
        label: order.pickup_location,
      },
    ],
    pickupLocation: {
      id: `${order.delivery_longitude},${order.delivery_latitude}`,
      label: order.delivery_location,
    },
  };

  return payload;
};

module.exports = { errandlr };
