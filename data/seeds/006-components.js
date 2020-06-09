const createJobheetSeed = (
	id,
	descriptions,
	manufacturer,
	partNum,
	cApp,
	image,
	resources,
	sheet
) => {
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
		maintenance_video: "",
	};
};

const application1 =
	"This electric motor is the input power for the hydraulic system, turning pump 2 at 1680 rpm.";
const application2 =
	"This pressure compensated axial piston pump provides flow and pressure to all components, including actuators, in the J1 hydraulic system.";
const application3 =
	"This ball valve isolates the inlet of pump 2 from the hydraulic reservoir.";

exports.seed = function(knex) {
	return knex("components").insert([
		createJobheetSeed(
			"1",
			"Electric Motor",
			"Baldor",
			"284TC",
			application1,
			"https://www.dropbox.com/s/l4v314vfosymou5/fabens-1970s.jpg?dl=0",
			"E099.mp4",
			"Baldor ElectricMotor284TC.pdf"
		),
		createJobheetSeed(
			"2",
			"Pump, Axial Piston",
			"Vickers",
			"PVM074ER09GS02AA-28",
			application2,
			"https://www.dropbox.com/s/2wmcigbf1cum062/schematic.jpg?dl=0",
			"H034.mp4",
			"Vickers PVM AxialPistonPump.pdf"
		),
		createJobheetSeed(
			"3",
			"Ball Valve",
			"Hydac",
			"Not Provided",
			application3,
			"https://www.dropbox.com/s/ef5yd1oipfbp6yk/cnc-machine-component-250x250.jpg?dl=0",
			"H098.mp4",
			"Hydac BallValve.pdf"
		),
	]);
};
