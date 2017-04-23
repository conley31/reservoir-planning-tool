function validateCalculatorInput() {
  var errors = [];
  var inputs = [];
  var validation = true;

  inputs.push({ name: "Smallest pond volume",
                value: document.forms["calculator-input"]["pondVolSmallest"].value });
  inputs.push({ name: "Largest pond volume",
                value: document.forms["calculator-input"]["pondVolLargest"].value });
  inputs.push({ name: "Pond volume increment",
                value: document.forms["calculator-input"]["pondVolIncrement"].value });
  inputs.push({ name: "Pond depth",
                value: document.forms["calculator-input"]["pondDepth"].value });
  inputs.push({ name: "Pond depth initial",
                value: document.forms["calculator-input"]["pondWaterDepthInitial"].value });
  inputs.push({ name: "Maximum soil moisture content",
                value: document.forms["calculator-input"]["maxSoilMoistureDepth"].value });
  inputs.push({ name: "Irrigation area",
                value: document.forms["calculator-input"]["irrigatedArea"].value });
  inputs.push({ name: "Irrigation depth",
                value: document.forms["calculator-input"]["irrigDepth"].value });
  inputs.push({ name: "Available water capacity",
                value: document.forms["calculator-input"]["availableWaterCapacity"].value });
  inputs.push({ name: "Drained area",
                value: document.forms["calculator-input"]["drainedArea"].value });

  for(var i = 0; i < inputs.length; i++) {
    if(isNaN(inputs[i]["value"])) {
      errors.push(inputs[i]["name"] + " must be a number.");
      validation = false;
    }
    if(inputs[i]["value"] < 0) {
      errors.push(inputs[i]["name"] + " must be greater than or equal to 0.");
      validation = false;
    }
    if(inputs[i]["value"] === "") {
      errors.push(inputs[i]["name"] + " is a required field.");
      validation = false;
    }
  }

  if(inputs[0]["value"] >= inputs[1]["value"]) {
    errors.push("Smallest pond volume must be less than the largest pond volume");
    validation = false;
  }

  return [validation, errors];
}