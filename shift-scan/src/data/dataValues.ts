
import prisma from "@/lib/prisma";
import { Prisma} from "@prisma/client";
import { hash } from "bcryptjs";

// jobsites
export const initialJobsites: Prisma.JobsiteCreateInput[]  = [
{ jobsite_id: "12345", jobsite_name: "First Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ jobsite_id: "23456" , jobsite_name: "Second Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ jobsite_id: "34567", jobsite_name: "Third Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ jobsite_id: "45678", jobsite_name: "Fourth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},{ jobsite_id: "56789",  jobsite_name: "Fifth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
},
{ jobsite_id: "67890", jobsite_name: "Sixth Site", jobsite_active: true, createdAt: new Date(), updatedAt: new Date(),
}
];
// time sheets create method
export const initialTimeSheets: Prisma.TimeSheetCreateInput[] = [
{
    submit_date: new Date(),
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
 // Updated to 'jobsite' instead of 'Jobsite'
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    total_break_time: 1.00,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'H>8-J>789>CC-101>T>6.',
    user: { connect: { id: "2" } },
    jobsite: { connect: { jobsite_id : "12345" } }
},
{
    submit_date: new Date(),
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite: { connect: { jobsite_id: "12345" } }, // Updated to 'jobsite' instead of 'Jobsite'
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    total_break_time: 1.00,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'H>8-J>789>CC-101>T>6.',
    user: { connect: { id: "2" } }
},
{
    submit_date: new Date(),
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite: { connect: { jobsite_id: "23456" } }, // Updated to 'jobsite' instead of 'Jobsite'
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    total_break_time: 1.01,
    duration: 6.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'Submitted on time.',
    user: { connect: { id: "1" } }
},
{
    submit_date: new Date(),
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite: { connect: { jobsite_id: "34567" } }, // Updated to 'jobsite' instead of 'Jobsite'
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
    total_break_time: 0.00,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'Submitted on time.',
    user: { connect: { id: "1" } }
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

{ createdAt: new Date(), updatedAt: new Date(), user: {
    connect: {id: "1"}},
    crew: {connect: {id: 1}}, supervisor: true

},

{ createdAt: new Date(), updatedAt: new Date(),
    user: { connect: {id: "2"}},
    crew: {connect: {id: 1}}, supervisor: false
},

{ createdAt: new Date(), updatedAt: new Date(),
    user: { connect: {id: "3"}},
    crew: {connect: {id: 1}},  supervisor: false
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
export const UserTrainings: Prisma.UserTrainingsCreateInput[] = [
    { "completed_trainings": 1, "assigned_trainings": 10, "completion": true, "User": { "connect": {
                "id": "1" } }, "trainings": { "completed": [1], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
        },
        { "completed_trainings": 5, "assigned_trainings": 10, "completion": true, "User": { "connect": {
                "id": "2" } }, "trainings": { "completed": [1, 2, 3, 4, 5], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
        },
        { "completed_trainings": 3, "assigned_trainings": 10, "completion": true, "User": { "connect": {
                "id": "3" } }, "trainings": { "completed": [1, 2, 3], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
        },
        { "completed_trainings": 2, "assigned_trainings": 10, "completion": true, "User": { "connect": {
                "id": "4" } }, "trainings": { "completed": [1, 3], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
        },
        { "completed_trainings": 1, "assigned_trainings": 10, "completion": true, "User": { "connect": {
                "id": "5" } }, "trainings": { "completed": [4], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
        },
];
// initializing users
export const initialUsers: Prisma.UserCreateInput[] = [
    { "id": "1", "firstName": "Jessica", "lastName": "Rabbit", "username": "jessicarabbit", "password": "securepassword", "DOB" : "01-01-2000" , "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "jessicarabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"
    },
    { "id": "2", "firstName": "John", "lastName": "Doe", "username": "johndoe", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "johndoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"
    },
    { "id": "3", "firstName": "Jane", "lastName": "Doe", "username": "janedoe", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "janedoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"
    },
    { "id": "4", "firstName": "Buggs", "lastName": "Bunny", "username": "buggsbunny", "password": "securepassword", "DOB" : "01-01-2000",  "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "buggsbunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  
    },
    { "id": "5", "firstName": "Lola", "lastName": "Bunny", "username": "lolabunny", "password": "securepassword", "DOB" : "01-01-2000",  "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "lolabunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  
    },
    { "id": "6", "firstName": "Roger", "lastName": "Rabbit", "username": "rogerrabbit", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "rogerrabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"
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

// initializing cost codes
export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
    { cost_code: "G-1.30", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Payroll", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-1.50", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Pour cement", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-2.30", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Labour", cost_code_type: "", Jobsite:{ connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-2.80", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "lift truck", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-8.50", createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", cost_code_description: "Picking", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-8.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Packing", cost_code_type: "", Jobsite:{ connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-7.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Roofing", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-6.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Building", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-4.30",    createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z", cost_code_description: "Delivery", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
},
{ cost_code: "G-5.30", createdAt: "2021-06-01T00:00:00.000Z", updatedAt: "2021-06-01T00:00:00.000Z",   cost_code_description: "Demolishing", cost_code_type: "", Jobsite: { connect: [{jobsite_id:"12345"}, {jobsite_id:"23456"}, {jobsite_id:"34567"}, {jobsite_id:"45678"}, {jobsite_id:"56789"}] }
}
]
export const initialCrewJobsites: Prisma.CrewJobsiteCreateInput[] = [
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { jobsite_id: "12345"}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { jobsite_id: "23456"}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { jobsite_id: "34567"}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { jobsite_id: "45678"}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { jobsite_id: "56789"}}
    },
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 4}}, jobsite: { connect: { jobsite_id: "67890"}}
    }
]
