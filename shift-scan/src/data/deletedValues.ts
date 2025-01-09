// deleted values within the database
// ---- All cost codes are here in case we need them again ----

// export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
//   {
//     id: "1",
//     name: "#01.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Engineering Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "2",
//     name: "#01.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Engineering Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "3",
//     name: "#01.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Engineering Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "4",
//     name: "#01.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Engineering Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "5",
//     name: "#02.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Earth Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "6",
//     name: "#02.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Earth Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "7",
//     name: "#02.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Earth Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "8",
//     name: "#02.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Earth Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "9",
//     name: "#03.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Concrete Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "10",
//     name: "#03.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Concrete Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "11",
//     name: "#03.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Concrete Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "12",
//     name: "#03.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Concrete Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "13",
//     name: "#04.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Finishes Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "14",
//     name: "#04.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Finishes Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "15",
//     name: "#04.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Finishes Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "16",
//     name: "#04.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Finishes Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "17",
//     name: "#05.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Steel Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "18",
//     name: "#05.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Steel Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "19",
//     name: "#05.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Steel Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "20",
//     name: "#05.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Steel Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "21",
//     name: "#06.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Wood Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "22",
//     name: "#06.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Wood Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "23",
//     name: "#06.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Wood Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "24",
//     name: "#06.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Wood Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "25",
//     name: "#07.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Insulation Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "26",
//     name: "#07.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Insulation Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "27",
//     name: "#07.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Insulation Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "28",
//     name: "#07.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Insulation Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "29",
//     name: "#08.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Door and Window Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "30",
//     name: "#08.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Door and Window labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "31",
//     name: "#08.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Door and Window Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "32",
//     name: "#08.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Door and Window Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "33",
//     name: "#09.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Utilities Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "34",
//     name: "#09.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Utilities Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "35",
//     name: "#09.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Utilities Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "36",
//     name: "#09.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Utilities Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "37",
//     name: "#10.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Process Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "38",
//     name: "#10.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Process Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "39",
//     name: "#10.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Process Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "40",
//     name: "#10.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Process Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "41",
//     name: "#11.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Shop Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "42",
//     name: "#11.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Shop Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "43",
//     name: "#11.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Shop Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "44",
//     name: "#11.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Shop Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "45",
//     name: "#12.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Pipe Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "46",
//     name: "#12.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Pipe Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "47",
//     name: "#12.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Pipe Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "48",
//     name: "#12.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Pipe Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "49",
//     name: "#13.10",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Trucking Material",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "50",
//     name: "#13.20",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Trucking Labor",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "51",
//     name: "#13.30",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Trucking Sub",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
//   {
//     id: "52",
//     name: "#13.40",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     description: "Trucking Equipment",
//     CCTags: {
//       connect: [], // No CCTags are linked initially
//     },
//   },
// ];

// export const initialCCTags: Prisma.CCTagCreateInput[] = [
//   {
//     name: "All",
//     jobsites: {
//       connect: [
//         { qrId: "j123" },
//         { qrId: "j234" },
//         { qrId: "j345" },
//         { qrId: "j456" },
//         { qrId: "j567" },
//       ],
//     },
//     costCodes: {
//       connect: Array.from({ length: 52 }, (_, i) => ({ id: (i + 1).toString() })),
//     },
//   },
// ];
