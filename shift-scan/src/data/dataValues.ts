
import { Prisma} from "@prisma/client";

export const now = new Date();

// jobsites
export const initialJobsites: Prisma.JobsitesCreateInput[] = [
{
    qrId: "j123",
    name: "Jobsite 1",
    streetNumber: "123",
    streetName: "Main St",
    city: "City",
    state: "State",
    country: "Country",
    description: "Description for Jobsite 1",
    comment: "Comments for Jobsite 1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qrId: "j234",
    name: "Jobsite 2",
    streetNumber: "234",
    streetName: "Second St",
    city: "City",
    state: "State",
    country: "Country",
    description: "Description for Jobsite 2",
    comment: "Comments for Jobsite 2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qrId: "j345",
    name: "Jobsite 3",
    streetNumber: "345",
    streetName: "Third St",
    city: "City",
    state: "State",
    country: "Country",
    description: "Description for Jobsite 3",
    comment: "Comments for Jobsite 3",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qrId: "j456",
    name: "Jobsite 4",
    streetNumber: "456",
    streetName: "Fourth St",
    city: "City",
    state: "State",
    country: "Country",
    description: "Description for Jobsite 4",
    comment: "Comments for Jobsite 4",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qrId: "j567",
    name: "Jobsite 5",
    streetNumber: "567",
    streetName: "Fifth St",
    city: "City",
    state: "State",
    country: "Country",
    description: "Description for Jobsite 5",
    comment: "Comments for Jobsite 5",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}
];

// time sheets create method
export const initialTimeSheets: Prisma.TimeSheetsCreateInput[] = [
{ submitDate: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { qrId: "j123" } }, costcode: '#cc123gdj1', startTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), endTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), duration: 4.00, timeSheetComments: 'No issues during the shift.', user: { connect: { id: "2" } } },
{ submitDate: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { qrId: "j123" } }, costcode: '#cc123gdj1', startTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), duration: 6.00, timeSheetComments: 'No issues during the shift.', user: { connect: { id: "1" } } },
{ submitDate: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { qrId: "j123" } }, costcode: '#cc123gdj1', startTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), endTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(), duration: 4.00, timeSheetComments: 'No issues during the shift.', user: { connect: { id: "1" } } },
{ submitDate: new Date("2024-07-30"), date: new Date("2024-07-30T00:00:00.000Z").toISOString(), jobsite: { connect: { qrId: "j123" } }, costcode: '#cc123gdj1', startTime: new Date("2024-07-30T15:00:00.000Z").toISOString(), endTime: new Date("2024-07-30T19:00:00.000Z").toISOString(), duration: 4.00, timeSheetComments: 'No issues during the shift.', user: { connect: { id: "1" } } },

];

// intaializing crew
export const initialCrews: Prisma.CrewsCreateInput[] = [
{ name: "Jessica's Crew", description: "General Contrator Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Devun's Crew", description: "A Computer Science and App development Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Dustin's Crew", description: "Trucking Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Seth's Crew", description: "Fabrication Crew", createdAt: new Date(), updatedAt: new Date(),},
];

// initializing crew members
export const initialCrewMembers: Prisma.CrewMembersCreateInput[] = [
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "1"}}, crew: {connect: {id: 1}}, supervisor: true },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "7"}}, crew: {connect: {id: 2}}, supervisor: true },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "8"}}, crew: {connect: {id: 2}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "9"}}, crew: {connect: {id: 2}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "2"}}, crew: {connect: {id: 1}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "3"}}, crew: {connect: {id: 1}},  supervisor: false },
];


// initializing users
export const initialUsers: Prisma.UsersCreateInput[] = [
{ "id": "1", "firstName": "Jessica", "lastName": "Rabbit", "username": "jessicarabbit", "password": "securepassword", "DOB" : "01-01-2000" , "truckView": true, "tascoView": false, "laborView": true, "mechanicView": false, "permission": "ADMIN",   "image": ""},
{ "id": "2", "firstName": "John", "lastName": "Doe", "username": "johndoe", "password": "securepassword", "DOB" : "01-01-2000", "truckView": true, "tascoView": true, "laborView": false, "mechanicView": false, "permission": "USER", "image": ""},
{ "id": "3", "firstName": "Jane", "lastName": "Doe", "username": "janedoe", "password": "securepassword", "DOB" : "01-01-2000", "truckView": true, "tascoView": true, "laborView": false, "mechanicView": false, "permission": "USER", "image": ""},
{ "id": "4", "firstName": "Buggs", "lastName": "Bunny", "username": "buggsbunny", "password": "securepassword", "DOB" : "01-01-2000",  "truckView": true, "tascoView": true, "laborView": false, "mechanicView": false, "permission": "USER", "image": ""  },
{ "id": "5", "firstName": "Lola", "lastName": "Bunny", "username": "lolabunny", "password": "securepassword", "DOB" : "01-01-2000",  "truckView": true, "tascoView": true, "laborView": false, "mechanicView": false, "permission": "USER",  "image": ""  },
{ "id": "6", "firstName": "Roger", "lastName": "Rabbit", "username": "rogerrabbit", "password": "securepassword", "DOB" : "01-01-2000", "truckView": true, "tascoView": false, "laborView": true, "mechanicView": false, "permission": "ADMIN","image": ""},
{ "id": "7", "firstName": "Devun", "lastName": "Durst", "username": "devunfox", "password": "securepassword", "DOB": "07-08-1999", "truckView": true, "tascoView": true, "laborView": true, "mechanicView": true, "permission": "SUPERADMIN", "image": ""},
{ "id": "8", "firstName": "Zachary", "lastName": "Robker", "username": "zrobker", "password": "securepassword", "DOB": "12-22-1996", "truckView": true, "tascoView": true, "laborView": true, "mechanicView": true, "permission": "SUPERADMIN", "image": ""},
{ "id": "9", "firstName": "Sean", "lastName": "walker", "username": "seanwalk", "password": "securepassword", "DOB": "06-15-2000", "truckView": true, "tascoView": true, "laborView": true, "mechanicView": true, "permission": "SUPERADMIN",  "image": ""}
];

// initializing contacts
export const initialContacts: Prisma.ContactsCreateInput[] = [
{ "user": { "connect": { "id": "1" }} , "phoneNumber": "123-456-7890", "email": "jessica.rabbit@example.com", "emergencyContact": "Roger Rabbit", "emergencyContactNumber": "098-765-4321", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "2" }} ,"phoneNumber": "987-654-3210", "email": "john.doe@example.com", "emergencyContact": "Jane Doe", "emergencyContactNumber": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "3" }} ,"phoneNumber": "987-654-3210", "email": "jane.doe@example.com", "emergencyContact": "John Doe", "emergencyContactNumber": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "4" }} ,"phoneNumber": "183-416-7890", "email": "buggsbunny@example.com", "emergencyContact": "Lola Bunny", "emergencyContactNumber": "218-765-4021", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "5" }} ,"phoneNumber": "987-654-3210", "email": "lolabunny@example.com", "emergencyContact": "Buggs Bunny", "emergencyContactNumber": "098-745-4121", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "6" }} ,"phoneNumber": "987-654-3210", "email": "jessica.rabbit@example.com", "emergencyContact": "Jessica Rabbit", "emergencyContactNumber": "098-765-4321", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "7" }} ,"phoneNumber": "987-654-3210", "email": "wife.@example.com", "emergencyContact": "your wife", "emergencyContactNumber": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "8" }} ,"phoneNumber": "987-654-3210", "email": "wife.@example.com", "emergencyContact": "your wife", "emergencyContactNumber": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "user": { "connect": { "id": "9" }} ,"phoneNumber": "987-654-3210", "email": "wife.@example.com", "emergencyContact": "your wife", "emergencyContactNumber": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
]
// initializing cost codes
export const initialCostCodes: Prisma.CostCodesCreateInput[] = [
{
    name: "#01.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Material",
    type: "engineer",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#01.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Labor",
    type: "engineer",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#01.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Sub",
    type: "engineer",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#01.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Engineering Equipment", 
    type: "Engineer",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#02.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Material",
    type: "Earth",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#02.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Labor",
    type: "Earth",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#02.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Sub",
    type: "Earth",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#02.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Earth Equipment",
    type: "Earth",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#03.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Material",
    type: "Concrete",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#03.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Labor",
    type: "Concrete",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#03.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Sub",
    type: "Concrete",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#03.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Concrete Equipment",
    type: "",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#04.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Material",
    type: "Finishes",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#04.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Labor",
    type: "Finishes",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#04.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Sub",
    type: "Finishes",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#04.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Finishes Equipment",
    type: "Finishes",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#05.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Material",
    type: "Steel",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#05.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Labor",
    type: "Steel",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#05.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Sub",
    type: "Steel",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#05.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Steel Equipment",
    type: "Steel",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#06.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Material",
    type: "Wood",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#06.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Labor",
    type: "Wood",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#06.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Sub",
    type: "Wood",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#06.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Wood Equipment",
    type: "Wood",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#07.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Material",
    type: "Insulation",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#07.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Labor",
    type: "Insulation",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#07.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Sub",
    type: "Insulation",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#07.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Insulation Equipment",
    type: "Insulation",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#08.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Material",
    type: "DoorAndWindow",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#08.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window labor",
    type: "DoorAndWindow",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#08.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Sub",
    type: "DoorAndWindow",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#08.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Door and Window Equipment",
    type: "DoorAndWindow",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#09.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Material",
    type: "Utilities",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#09.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Labor",
    type: "Utilities",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#09.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Sub",
    type: "Utilities",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#09.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Utilities Equipment",
    type: "Utilities",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#10.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Material",
    type: "Process",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#10.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Labor",
    type: "Process",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#10.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Sub",
    type: "Process",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#10.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Process Equipment",
    type: "Process",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#11.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Material",
    type: "Shop",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#11.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Labor",
    type: "Shop",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#11.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Sub",
    type: "Shop",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#11.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Shop Equipment",
    type: "Shop",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#12.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Material",
    type: "Pipe",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#12.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Labor",
    type: "Pipe",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#12.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Sub",
    type: "Pipe",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#12.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Pipe Equipment",
    type: "Pipe",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#13.10",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Material",
    type: "Trucking",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
}, 
{
    name: "#13.20",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Labor",
    type: "Trucking",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#13.30",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Sub",
    type: "Trucking",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
},
{
    name: "#13.40",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Trucking Equipment",
    type: "Trucking",
    Jobsite: {
        connect: [
            { qrId: "j123" },
            { qrId: "j234" },
            { qrId: "j345" },
            { qrId: "j456" },
            { qrId: "j567" }
        ]
    }
}
];

export const initialCrewJobsites: Prisma.CrewJobsitesCreateInput[] = [
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 4}}, jobsite: { connect: { qrId: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { qrId: "j123"}}}
]

export const intialEquipment: Prisma.EquipmentCreateInput[] = [
// equipment
{ qrId: "EQ-100000",name: "ALKOTA PRESSURE WASHER", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection:new Date(now), lastRepair :new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true},
{ qrId: "EQ-100001", name: "CABLE PLOW", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100002", name: "CablePlo - Cable Plow Case", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100003", name: "Case International Chisel Dyker", description: "Case International Chisel Dyker", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100004", name: "CATTRACK", description: "CAT TRACK TRACTOR CH65", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100005", name: "CEMENT FORMS", description: "CEMENT FORMS", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100006", name: "CEMENT MIXER HYDRAULIC", description: "CEMENT MIXER HYDRAULIC", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100007", name: "CHAMP LIFT", description: "CHAMP LIFT", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100008", name: "CHISEL PLOW", description: "CHISEL PLOW", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100009", name: "CONCRETE FORMS", description: "CONCRETE FORMS", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100010", name: "CONCRETE MIXER#1", description: "CONCRETE MIXER#1", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100011", name: "CONCRETE SAW #1", description: "CONCRETE SAW SOFT CUT #1", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100012", name: "CONCRETE SAW #2", description: "CONCRETE SAW SOFT CUT #2", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },

{ qrId: "EQ-100013", name: "CPS 1", description: "CONCRETE POWER SCREED", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100014", name: "CR1 - Grove RT Crane 1986", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100015", name: "CR2 - Manitowoc 275 Ton Crane 2002", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100016", name: "CR3 - RT890 Ton Crane", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100017", name: "CR4", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100018", name: "CR5 Medium", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100019", name: "CR6 mini crane", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100020", name: "CT 1 - Cement Truck 1 - 7846", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100021", name: "CT 2 - Cement Truck 2 - 7955", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100022", name: "D1 - CAT D6R LGP Bulldozer", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100023", name: "D2 - JD 850K DOZER", description: "JD 850K DOZER", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100024", name: "DIGGA", description: "DIGGA PIER DRIVE HEAD", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100025", name: "DT 11 - Volvo A25c 6x6 Articulated Dump Truck", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
{ qrId: "EQ-100026", name: "DT10 - Volvo A35C Haul Truck", description: "", status: "OPERATIONAL", equipmentTag: "EQUIPMENT", lastInspection: new Date(now), lastRepair:new Date(now), createdAt: new Date(now), updatedAt: new Date(now), make: "", model: "", year: "", licensePlate: "", registrationExpiration: null, mileage: null, isActive: true },
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
    isActive: true
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
    isActive: true
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
    isActive: true
}
]

export const initialUserSettings: Prisma.UserSettingsCreateInput[] = [
    { user: { connect: { id: "1" } } },
    { user: { connect: { id: "2" } } },
    { user: { connect: { id: "3" } } },
    { user: { connect: { id: "4" } } },
    { user: { connect: { id: "5" } } },
    { user: { connect: { id: "6" } } },
    { user: { connect: { id: "7" } } },
    { user: { connect: { id: "8" } } },
    { user: { connect: { id: "9" } } }
]