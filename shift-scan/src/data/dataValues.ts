import { Prisma } from "@prisma/client";

export const now = new Date();

// jobsites
export const initialJobsites: Prisma.JobsiteCreateInput[] = [
  {
    id: "1",
    qrId: "j123",
    name: "Jobsite 1",
    description: "Description for Jobsite 1",
    address: "123 Main St",
    city: "City",
    state: "State",
    zipCode: "12345",
    country: "Country",
    comment: "Comments for Jobsite 1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    employeeEquipmentLogs: {
      connect: [], // No employeeEquipmentLogs are linked initially
    },
    timeSheets: {
      connect: [], // No timeSheets are linked initially
    },
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
    equipment: {
      connect: [], // No equipment are linked initially
    },
  },
  {
    qrId: "j234",
    name: "Jobsite 2",
    description: "Description for Jobsite 2",
    address: "456 Main St",
    city: "City",
    state: "State",
    zipCode: "67890",
    country: "Country",
    comment: "Comments for Jobsite 2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    employeeEquipmentLogs: {
      connect: [], // No employeeEquipmentLogs are linked initially
    },
    timeSheets: {
      connect: [], // No timeSheets are linked initially
    },
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
    equipment: {
      connect: [], // No equipment are linked initially
    },
  },
  {
    qrId: "j345",
    name: "Jobsite 3",
    description: "Description for Jobsite 3",
    address: "789 Main St",
    city: "City",
    state: "State",
    zipCode: "12345",
    country: "Country",
    comment: "Comments for Jobsite 3",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    employeeEquipmentLogs: {
      connect: [], // No employeeEquipmentLogs are linked initially
    },
    timeSheets: {
      connect: [], // No timeSheets are linked initially
    },
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
    equipment: {
      connect: [], // No equipment are linked initially
    },
    },
    {
      qrId: "j456",
      name: "Jobsite 4",
      description: "Description for Jobsite 4",
      address: "101 Main St",
      city: "City",
      state: "State",
      zipCode: "12345",
      country: "Country",
      comment: "Comments for Jobsite 4",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      employeeEquipmentLogs: {
        connect: [], // No employeeEquipmentLogs are linked initially
      },
      timeSheets: {
        connect: [], // No timeSheets are linked initially
      },
      CCTags: {
        connect: [], // No CCTags are linked initially
      },
      equipment: {
        connect: [], // No equipment are linked initially
      },
    },
    {
      qrId: "j567",
      name: "Jobsite 5",
      description: "Description for Jobsite 5",
      address: "102 Main St",
      city: "City",
      state: "State",
      zipCode: "12345",
      country: "Country",
      comment: "Comments for Jobsite 5",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      employeeEquipmentLogs: {
        connect: [], // No employeeEquipmentLogs are linked initially
      },
      timeSheets: {
        connect: [], // No timeSheets are linked initially
      },
      CCTags: {
        connect: [], // No CCTags are linked initially
      },
      equipment: {
        connect: [], // No equipment are linked initially
      },
    },
];

// intaializing crew
export const initialCrews: Prisma.CrewCreateInput[] = [
  {
    name: "Jessica's Crew",
    leadId: "1",
    description: "General Contrator Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
    users: { connect: [
      { id: "1" },
      { id: "2" },
      { id: "3" },
    ] },
  },
  {
    name: "Devun's Crew",
    leadId: "7",
    description: "A Computer Science and App development Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
    users: { connect: [
      { id: "7" },
      { id: "8" },
      { id: "9" },
    ] },
  },
];

// initializing users
export const initialUsers: Prisma.UserCreateInput[] = [
  {
    id: "1",
    firstName: "Jessica",
    lastName: "Rabbit",
    username: "jessicarabbit",
    email: "test01@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: false,
    laborView: true,
    mechanicView: false,
    permission: "ADMIN",
    image: "",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "test02@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: true,
    laborView: false,
    mechanicView: false,
    permission: "USER",
    image: "",
  },
  {
    id: "3",
    firstName: "Jane",
    lastName: "Doe",
    username: "janedoe",
    email: "test03@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: true,
    laborView: false,
    mechanicView: false,
    permission: "USER",
    image: "",
  },
  {
    id: "4",
    firstName: "Buggs",
    lastName: "Bunny",
    username: "buggsbunny",
    email: "test04@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: true,
    laborView: false,
    mechanicView: false,
    permission: "USER",
    image: "",
  },
  {
    id: "5",
    firstName: "Lola",
    lastName: "Bunny",
    username: "lolabunny",
    email: "test05@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: true,
    laborView: false,
    mechanicView: false,
    permission: "USER",
    image: "",
  },
  {
    id: "6",
    firstName: "Roger",
    lastName: "Rabbit",
    username: "rogerrabbit",
    email: "test06@gmail.com",
    password: "securepassword",
    DOB: "01-01-2000",
    truckView: true,
    tascoView: false,
    laborView: true,
    mechanicView: false,
    permission: "ADMIN",
    image: "",
  },
  {
    id: "7",
    firstName: "Devun",
    lastName: "Durst",
    username: "devunfox",
    email: "devunfox15@gmail.com",
    password: "securepassword",
    DOB: "07-08-1999",
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
  },
  {
    id: "8",
    firstName: "Zachary",
    lastName: "Robker",
    username: "zrobker",
    email: "test08@gmail.com",
    password: "securepassword",
    DOB: "12-22-1996",
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
  },
  {
    id: "9",
    firstName: "Sean",
    lastName: "walker",
    username: "seanwalk",
    email: "test09@gmail.com",
    password: "securepassword",
    DOB: "06-15-2000",
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
  },
];

// initializing contacts
export const initialContacts: Prisma.ContactsCreateInput[] = [
  {
    user: { connect: { id: "1" } },
    phoneNumber: "123-456-7890",
    emergencyContact: "Roger Rabbit",
    emergencyContactNumber: "098-765-4321",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "2" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "Jane Doe",
    emergencyContactNumber: "123-456-7890",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "3" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "John Doe",
    emergencyContactNumber: "123-456-7890",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "4" } },
    phoneNumber: "183-416-7890",
    emergencyContact: "Lola Bunny",
    emergencyContactNumber: "218-765-4021",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "5" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "Buggs Bunny",
    emergencyContactNumber: "098-745-4121",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "6" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "Jessica Rabbit",
    emergencyContactNumber: "098-765-4321",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "7" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "your wife",
    emergencyContactNumber: "218-765-4311",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "8" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "your wife",
    emergencyContactNumber: "218-765-4311",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
  {
    user: { connect: { id: "9" } },
    phoneNumber: "987-654-3210",
    emergencyContact: "your wife",
    emergencyContactNumber: "218-765-4311",
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
  },
];
// initializing cost codes
export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
  {
    id: "1",
    name: "#01.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "2",
    name: "#01.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "3",
    name: "#01.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "4",
    name: "#01.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "5",
    name: "#02.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "6",
    name: "#02.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "7",
    name: "#02.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "8",
    name: "#02.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "9",
    name: "#03.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "10",
    name: "#03.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "11",
    name: "#03.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "12",
    name: "#03.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "13",
    name: "#04.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "14",
    name: "#04.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "15",
    name: "#04.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "16",
    name: "#04.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "17",
    name: "#05.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "18",
    name: "#05.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "19",
    name: "#05.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "20",
    name: "#05.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "21",
    name: "#06.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "22",
    name: "#06.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "23",
    name: "#06.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "24",
    name: "#06.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "25",
    name: "#07.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "26",
    name: "#07.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "27",
    name: "#07.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "28",
    name: "#07.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "29",
    name: "#08.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "30",
    name: "#08.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "31",
    name: "#08.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "32",
    name: "#08.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "33",
    name: "#09.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "34",
    name: "#09.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "35",
    name: "#09.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "36",
    name: "#09.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "37",
    name: "#10.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "38",
    name: "#10.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "39",
    name: "#10.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "40",
    name: "#10.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "41",
    name: "#11.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "42",
    name: "#11.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "43",
    name: "#11.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "44",
    name: "#11.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "45",
    name: "#12.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "46",
    name: "#12.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "47",
    name: "#12.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "48",
    name: "#12.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "49",
    name: "#13.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Material",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "50",
    name: "#13.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Labor",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "51",
    name: "#13.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Sub",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
  {
    id: "52",
    name: "#13.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Equipment",
    CCTags: {
      connect: [], // No CCTags are linked initially
    },
  },
];

export const initialCCTags: Prisma.CCTagCreateInput[] = [
  {
    name: "All",
    jobsites: {
      connect: [
        { qrId: "j123" },
        { qrId: "j234" },
        { qrId: "j345" },
        { qrId: "j456" },
        { qrId: "j567" },
      ],
    },
    costCodes: {
      connect: Array.from({ length: 52 }, (_, i) => ({ id: (i + 1).toString() })),
    },
  },
];

export const intialEquipment: Prisma.EquipmentCreateInput[] = [
  // equipment
  {
    qrId: "EQ-100000",
    name: "ALKOTA PRESSURE WASHER",
    description: "",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    status: "OPERATIONAL",
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100001",
    name: "CABLE PLOW",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100002",
    name: "CablePlo - Cable Plow Case",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100003",
    name: "Case International Chisel Dyker",
    description: "Case International Chisel Dyker",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100004",
    name: "CATTRACK",
    description: "CAT TRACK TRACTOR CH65",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100005",
    name: "CEMENT FORMS",
    description: "CEMENT FORMS",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100006",
    name: "CEMENT MIXER HYDRAULIC",
    description: "CEMENT MIXER HYDRAULIC",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100007",
    name: "CHAMP LIFT",
    description: "CHAMP LIFT",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100008",
    name: "CHISEL PLOW",
    description: "CHISEL PLOW",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100009",
    name: "CONCRETE FORMS",
    description: "CONCRETE FORMS",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100010",
    name: "CONCRETE MIXER#1",
    description: "CONCRETE MIXER#1",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100011",
    name: "CONCRETE SAW #1",
    description: "CONCRETE SAW SOFT CUT #1",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100012",
    name: "CONCRETE SAW #2",
    description: "CONCRETE SAW SOFT CUT #2",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },

  {
    qrId: "EQ-100013",
    name: "CPS 1",
    description: "CONCRETE POWER SCREED",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100014",
    name: "CR1 - Grove RT Crane 1986",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100015",
    name: "CR2 - Manitowoc 275 Ton Crane 2002",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100016",
    name: "CR3 - RT890 Ton Crane",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100017",
    name: "CR4",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100018",
    name: "CR5 Medium",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100019",
    name: "CR6 mini crane",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100020",
    name: "CT 1 - Cement Truck 1 - 7846",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100021",
    name: "CT 2 - Cement Truck 2 - 7955",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100022",
    name: "D1 - CAT D6R LGP Bulldozer",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100023",
    name: "D2 - JD 850K DOZER",
    description: "JD 850K DOZER",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100024",
    name: "DIGGA",
    description: "DIGGA PIER DRIVE HEAD",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100025",
    name: "DT 11 - Volvo A25c 6x6 Articulated Dump Truck",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-100026",
    name: "DT10 - Volvo A35C Haul Truck",
    description: "",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date(now),
    lastRepair: new Date(now),
    createdAt: new Date(now),
    updatedAt: new Date(now),
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    registrationExpiration: null,
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  // start page 3 of equipment assignar
  // trailers
  {
    qrId: "EQ-654321",
    name: "Trailer TX200",
    description: "Utility trailer for transporting equipment",
    status: "OPERATIONAL",
    equipmentTag: "TRAILER",
    lastInspection: new Date("2023-03-20T00:00:00.000Z"),
    lastRepair: null,
    createdAt: new Date("2024-07-25T00:00:00.000Z"),
    updatedAt: new Date("2024-07-25T00:00:00.000Z"),
    make: "BigTex",
    model: "TX200",
    year: "2018",
    licensePlate: "TRL456",
    registrationExpiration: new Date("2018-05-30T00:00:00.000Z"),
    mileage: null,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },

  // vehicles
  {
    qrId: "EQ-789012",
    name: "Bulldozer B450",
    description: "Powerful bulldozer for heavy-duty tasks",
    status: "OPERATIONAL",
    equipmentTag: "VEHICLE",
    lastInspection: new Date("2023-02-10T00:00:00.000Z"),
    lastRepair: new Date("2023-01-05T00:00:00.000Z"),
    createdAt: new Date("2024-07-25T00:00:00.000Z"),
    updatedAt: new Date("2024-07-25T00:00:00.000Z"),
    make: "Komatsu",
    model: "B450",
    year: "2019",
    licensePlate: "BDZ789",
    registrationExpiration: new Date("2019-06-25T00:00:00.000Z"),
    mileage: 800,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
  {
    qrId: "EQ-123456",
    name: "Excavator 3000",
    description: "Heavy-duty excavator for construction sites",
    status: "OPERATIONAL",
    equipmentTag: "EQUIPMENT",
    lastInspection: new Date("2023-06-15T00:00:00.000Z"),
    lastRepair: new Date("2023-05-10T00:00:00.000Z"),
    createdAt: new Date("2024-07-25T00:00:00.000Z"),
    updatedAt: new Date("2024-07-25T00:00:00.000Z"),
    make: "Caterpillar",
    model: "CAT3000",
    year: "2020",
    licensePlate: "PLT123",
    registrationExpiration: new Date("2021-01-20T00:00:00.000Z"),
    mileage: 1200,
    isActive: true,
    jobsite: {
      connect: { id: "1" },
    },
  },
];

export const initialUserSettings: Prisma.UserSettingsCreateInput[] = [
  { user: { connect: { id: "1" } } },
  { user: { connect: { id: "2" } } },
  { user: { connect: { id: "3" } } },
  { user: { connect: { id: "4" } } },
  { user: { connect: { id: "5" } } },
  { user: { connect: { id: "6" } } },
  { user: { connect: { id: "7" } } },
  { user: { connect: { id: "8" } } },
  { user: { connect: { id: "9" } } },
];
