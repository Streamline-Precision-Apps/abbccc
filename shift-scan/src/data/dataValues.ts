
import { Prisma} from "@prisma/client";
import { hash } from "bcryptjs";

// jobsites
export const initialJobsites: Prisma.JobsiteCreateInput[]  = [
{qr_id : "12345", jobsite_name: "First Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ qr_id : "23456", jobsite_name: "Second Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ qr_id : "34567", jobsite_name: "Third Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ qr_id : "45678", jobsite_name: "Fourth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},{
    qr_id : "56789", jobsite_name: "Fifth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{
    qr_id : "67890", jobsite_name: "Sixth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
}
];
// time sheets create method
export const initialTimeSheets: Prisma.TimeSheetCreateInput[] = [
{ submit_date: new Date(), form_id: 123, date:new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite_id: 789, costcode: 'CC-101', start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), total_break_time: 0, duration: 4.00, timesheet_comments: 'No issues during the shift.', app_comment: 'H>8-J>789>CC-101>T>6.', employee: {
    connect: {
        id: 2
    }
    }
},
{ submit_date: new Date(), form_id: 124, date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite_id: 719, costcode: 'CC-101', start_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), total_break_time: 1.00, duration: 4.00, timesheet_comments: 'No issues during the shift.', app_comment: 'H>8-J>789>CC-101>T>6.', employee: {
    connect: {
        id: 2
    }
    }
},
{ submit_date: new Date(), form_id: 125, date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite_id: 789, costcode: 'CC-101', start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), total_break_time: 60, duration: 6.00, timesheet_comments: 'No issues during the shift.', app_comment: 'Submitted on time.',
    employee: {
    connect: {
        id: 1
    }
    }
},
{ submit_date: new Date(), form_id: 126, date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite_id: 789, costcode: 'CC-101', start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(), total_break_time: 0, duration: 4.00, timesheet_comments: 'No issues during the shift.', app_comment: 'Submitted on time.', employee: {
    connect: {
        id: 1
    }
    }
}
];
// intaializing crew
export const initialCrews: Prisma.CrewCreateInput[] = [
{ name: "Jessica's Crew", description: "General Contrator Crew", createdAt: new Date(), updatedAt: new Date(),
},
{ name: "Devun's Crew", description: "A Computer Science and App development Crew", createdAt: new Date(), updatedAt: new Date(),
},
{ name: "Dustin's Crew", description: "Trucking Crew", createdAt: new Date(), updatedAt: new Date(),
},
{ name: "Seth's Crew", description: "Fabrication Crew", createdAt: new Date(), updatedAt: new Date(),
},
];
// initializing crew members
export const initialCrewMembers: Prisma.CrewMemberCreateInput[] = [

{ createdAt: new Date(), updatedAt: new Date(), employee: {
    connect: {id: 1}},
    crew: {connect: {id: 1}}

},

{ createdAt: new Date(), updatedAt: new Date(),
    employee: { connect: {id: 2}},
    crew: {connect: {id: 1}}
},

];
// creating train courses here:
export const initialTrainings: Prisma.TrainingsCreateInput[] = [
{ name: "Training 1", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),
},
{ name: "Training 2", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),
},

{ name: "Training 3", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),

}, 
{ name: "Training 4", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),

},
{ name: "Training 5", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),
},  
];
// creating training courses here:
export const employeeTrainings: Prisma.EmployeeTrainingsCreateInput[] = [
    { completed_trainings: 1, assigned_trainings: 10, completion: true, User: { connect: { id: "1" } }, trainings: {
        Training: {
        id: [1],
        },
    },
    },
    { completed_trainings: 5, assigned_trainings: 10, completion: true, User: { connect: { id: "2" } }, trainings: {
        Training: {
        id: [1, 2, 3, 4, 5],
        },
    },
    },
    { completed_trainings: 3, assigned_trainings: 10, completion: true, User: { connect: { id: "3" } }, trainings: {
        Training: {
        id: [1, 2, 3],
        },
    },
    },
    { completed_trainings: 2, assigned_trainings: 10, completion: true, User: { connect: { id: "4" } }, trainings: {
        Training: {
        id: [1, 3],
        },
    },
    },
    { completed_trainings: 1, assigned_trainings: 10, completion: true, User: { connect: { id: "5" } }, trainings: {
        Training: {
        id: [4],
        },
    },
    },
];
// initializing users
export const initialUsers: Prisma.UserCreateInput[] = [
{ "id": "1", "firstName": "Jessica", "lastName": "Rabbit", "username": "jessicarabbit", "password": "securepassword", "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "jessicarabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"
    },
    { "id": "2", "firstName": "John", "lastName": "Doe", "username": "johndoe", "password": "securepassword", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "johndoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"
    },
    { "id": "3", "firstName": "Jane", "lastName": "Doe", "username": "janedoe", "password": "securepassword", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "janedoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"
    },
    { "id": "4", "firstName": "Buggs", "lastName": "Bunny", "username": "buggsbunny", "password": "securepassword", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "buggsbunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  
    },
    { "id": "5", "firstName": "Lola", "lastName": "Bunny", "username": "lolabunny", "password": "securepassword", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "lolabunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  
    },
    { "id": "6", "firstName": "Roger", "lastName": "Rabbit", "username": "rogerrabbit", "password": "securepassword", "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "rogerrabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"
    }
];
// initializing employees
export const initialEmployees: Prisma.EmployeeCreateInput[] = [
{ "first_name": "Jessica", "last_name": "Rabbit", "dob": "1990-01-01T00:00:00.000Z", "availability": "MTWRF 6am - 10pm", "start_date": "2022-01-01T00:00:00.000Z", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "first_name": "John", "last_name": "Doe", "dob": "1985-05-15T00:00:00.000Z", "availability": "MTWRF 7am - 6pm", "start_date": "2021-06-01T00:00:00.000Z", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"   
},
{ "first_name": "Jane", "last_name": "Doe", "dob": "1990-01-01T00:00:00.000Z", "availability": "MTWRF 6am - 10pm", "start_date": "2022-01-01T00:00:00.000Z", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "first_name": "Buggs", "last_name": "Bunny", "dob": "1990-01-01T00:00:00.000Z", "availability": "MTWRF 6am - 10pm", "start_date": "2022-01-01T00:00:00.000Z", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z" 
},
{ "first_name": "Lola", "last_name": "Bunny", "dob": "1990-01-01T00:00:00.000Z", "availability": "MTWRF 6am - 10pm", "start_date": "2022-01-01T00:00:00.000Z", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z" 
},
{ "first_name": "Roger", "last_name": "Rabbit", "dob": "1985-05-15T00:00:00.000Z", "availability": "MTWRF 7am - 6pm", "start_date": "2021-06-01T00:00:00.000Z", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z" 
}
];
// initializing contacts
export const initialContacts: Prisma.ContactCreateInput[] = [
{ "phone_number": "123-456-7890", "email": "jessica.rabbit@example.com", "emergency_contact": "Roger Rabbit", "emergency_contact_no": "098-765-4321", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "phone_number": "987-654-3210", "email": "john.doe@example.com", "emergency_contact": "Jane Doe", "emergency_contact_no": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
},
{ "phone_number": "987-654-3210", "email": "jane.doe@example.com", "emergency_contact": "John Doe", "emergency_contact_no": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
},
{ "phone_number": "183-416-7890", "email": "buggsbunny@example.com", "emergency_contact": "Lola Bunny", "emergency_contact_no": "218-765-4021", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "phone_number": "987-654-3210", "email": "lolabunny@example.com", "emergency_contact": "Buggs Bunny", "emergency_contact_no": "098-745-4121", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "phone_number": "987-654-3210", "email": "jessica.rabbit@example.com", "emergency_contact": "Jessica Rabbit", "emergency_contact_no": "098-765-4321", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
}
]
// initializing addresses
export const initialAddresses: Prisma.AddressCreateInput[] = [
{ "address": "322 Main St", "city": "Anytown", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z" 
},
{ "address": "324 Main St", "city": "Anytown", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
},
{ "address": "21 Second St", "city": "Anycity", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
},
{ "address": "12 Main St", "city": "Anytown", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "address": "1278 Main St", "city": "Anytown", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"
},
{ "address": "32 Main St", "city": "Anytown", "state": "CA", "zipcode": 12345, "country": "USA", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"
}
]
// connected to the address and employees they need to run 1st
export const initialAddressEmployees: Prisma.AddressEmployeeCreateInput[] = [
{
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
    employee: { connect: {id: 1}},
    address: { connect: { id: 1}}
},
{
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
    employee: { connect: {id: 2}},
    address: { connect: { id: 2}}
},
{
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
    employee: { connect: {id: 3}},
    address: { connect: { id: 3}}
},
{
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
    employee: { connect: {id: 4}},
    address: { connect: { id: 4}}
},
{
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
    employee: { connect: {id: 5}},
    address: { connect: { id: 5}}
},
{
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2021-06-01T00:00:00.000Z",
    employee: { connect: {id: 6}},
    address: { connect: { id: 6}}
}
]
// initializing cost codes
export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
    { cost_code: "G-1.30", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Payroll", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] }
},
{ cost_code: "G-1.50", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Pour cement", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] }
},
{ cost_code: "G-2.30", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Labour", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
},
{ cost_code: "G-2.80", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "lift truck", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
},
{ cost_code: "G-8.50", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Picking", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6}  ] },
},
{ cost_code: "G-8.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Packing", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
},
{ cost_code: "G-7.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Roofing", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
},
{ cost_code: "G-6.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Building", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4} , {id:5}, {id:6} ] },
},
{ cost_code: "G-4.30",    createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Delivery", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
},
{ cost_code: "G-5.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z",   cost_code_description: "Demolishing", cost_code_type: "", Jobsite: { connect: [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6} ] },
}
]
export const initialCrewJobsites: Prisma.CrewJobsiteCreateInput[] = [
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { id: 1}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { id: 2}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { id: 3}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { id: 4}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { id: 5}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 4}}, jobsite: { connect: { id: 6}}
    }
]
