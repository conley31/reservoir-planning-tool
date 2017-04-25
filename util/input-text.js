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
      unit: "acre-feet",
      tooltip: "The Tool will conduct a simulation for each pond volume between the “Smallest Pond Volume” and the “Largest Pond Volume” using this increment."
    },
    {
      label: "Pond Depth",
      value: "10",
      name: "pondDepth",
      unit: "feet",
      tooltip: "The maximum possible depth of water in the pond."
    },
    {
      label: "Depth of Water on First Day of Simulation",
      value: "10",
      name: "pondWaterDepthInitial",
      unit: "feet"
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
      unit: "acres",
      tooltip: "The area to be irrigated from the pond. Normally this would be less than the drained area, in order to provide sufficient water.",
    },
    {
      label: "Irrigation Depth Applied at One Time",
      value: "1",
      name: "irrigDepth",
      unit: "inches"
    },
    {
      label: "Maximum Soil Moisture Content",
      value: "10",
      name: "maxSoilMoistureDepth",
      unit: "inches",
      tooltip: "Inches of water in the soil profile at saturation."
    },
    {
      label: "Available Water Capacity",
      value: "5",
      name: "availableWaterCapacity",
      unit: "inches",
      tooltip: "Inches of water representing the difference between field capacity and wilting point, used in calculating the need for irrigation (50% AWC)"
    },
  ];

  return irrigationArray;
}
