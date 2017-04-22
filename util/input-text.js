//Data used to fill in form in /views/partials/calculator-input.ejs

exports.getPondArray = function() {
  var pondArray = [
    {
      label: "Smallest Pond Volume",
      value: "10",
      name: "pondVolSmallest",
      unit: "acre-feet"
    },
    {
      label: "Largest Pond Volume",
      value: "100",
      name: "pondVolLargest",
      unit: "acre-feet"
    },
    {
      label: "Pond Volume Increment",
      value: "10",
      name: "pondVolIncrement",
      unit: "acre-feet"
    },
    {
      label: "Pond Depth",
      value: "10",
      name: "pondDepth",
      unit: "feet"
    },
    {
      label: "Depth of Water on First Day of Simulation",
      value: "10",
      name: "pondWaterDepthInitial",
      unit: "acre-feet"
    }
  ];
  return pondArray;
}

exports.getIrrigationArray = function() {
  var irrigationArray = [
    {
      label: "Irrigation Area",
      value: "80",
      name: "irrigatedArea",
      unit: "inches"
    },
    {
      label: "Irrigation Depth",
      value: "1",
      name: "irrigDepth",
      unit: "inches"
    },
    {
      label: "Maximum Soil Moisture Content",
      value: "10",
      name: "maxSoilMoistureDepth",
      unit: "inches"
    },
    {
      label: "Available Water Capacity",
      value: "5",
      name: "availableWaterCapacity",
      unit: "inches"
    },
  ];

  return irrigationArray;
}
