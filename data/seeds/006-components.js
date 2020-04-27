const createJobheetSeed = (id, descriptions, manufacturer, partNum, cApp, image, resources, sheet) => {
  return {
    jobsheet_id: 1,
    component_id: id,
    rl_category: "",
    rl_number: "",
    descriptions: descriptions,
    manufacturer: manufacturer,
    part_number: partNum,
    stock_code: "",
    electrical_address: "",
    component_application: cApp,
    reference_tag: "",
    settings: "",
    image: image,
    resources: resources,
    cutsheet: sheet,
    maintenance_video: ""
  }
};

const application1 = "This electric motor is the input power for the hydraulic system, turning pump 2 at 1680 rpm.";
const application2 = "This pressure compensated axial piston pump provides flow and pressure to all components, including actuators, in the J1 hydraulic system.";
const application3 = "This ball valve isolates the inlet of pump 2 from the hydraulic reservoir.";

exports.seed = function(knex) {
  return knex("components").insert([
    createJobheetSeed('1', "Electric Motor", "Baldor", "284TC", application1, "1.jpg", "E099.mp4", "Baldor ElectricMotor284TC.pdf"),
    createJobheetSeed('2', "Pump, Axial Piston", "Vickers", "PVM074ER09GS02AA-28", application2, "2.jpg", "H034.mp4", "Vickers PVM AxialPistonPump.pdf"),
    createJobheetSeed('3', "Ball Valve", "Hydac", "Not Provided", application3, "3.jpg", "H098.mp4", "Hydac BallValve.pdf")
  ]);
};
