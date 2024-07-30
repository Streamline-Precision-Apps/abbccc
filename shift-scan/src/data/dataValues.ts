
import prisma from "@/lib/prisma";
import { Prisma} from "@prisma/client";

// jobsites
export const initialJobsites: Prisma.JobsiteCreateInput[] = [
  {
    jobsite_id: "j123",
    jobsite_name: "Jobsite 1",
    street_number: "123",
    street_name: "Main St",
    city: "City",
    state: "State",
    country: "Country",
    jobsite_description: "Description for Jobsite 1",
    comments: "Comments for Jobsite 1",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    jobsite_id: "j234",
    jobsite_name: "Jobsite 2",
    street_number: "234",
    street_name: "Second St",
    city: "City",
    state: "State",
    country: "Country",
    jobsite_description: "Description for Jobsite 2",
    comments: "Comments for Jobsite 2",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    jobsite_id: "j345",
    jobsite_name: "Jobsite 3",
    street_number: "345",
    street_name: "Third St",
    city: "City",
    state: "State",
    country: "Country",
    jobsite_description: "Description for Jobsite 3",
    comments: "Comments for Jobsite 3",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    jobsite_id: "j456",
    jobsite_name: "Jobsite 4",
    street_number: "456",
    street_name: "Fourth St",
    city: "City",
    state: "State",
    country: "Country",
    jobsite_description: "Description for Jobsite 4",
    comments: "Comments for Jobsite 4",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    jobsite_id: "j567",
    jobsite_name: "Jobsite 5",
    street_number: "567",
    street_name: "Fifth St",
    city: "City",
    state: "State",
    country: "Country",
    jobsite_description: "Description for Jobsite 5",
    comments: "Comments for Jobsite 5",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// time sheets create method
export const initialTimeSheets: Prisma.TimeSheetCreateInput[] = [
{ submit_date: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { jobsite_id: "j123" } }, costcode: '#cc123gdj1', start_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), total_break_time: 1.00, duration: 4.00, timesheet_comments: 'No issues during the shift.', app_comment: 'H>8-J>789>CC-101>T>6.', user: { connect: { id: "2" } } },
{ submit_date: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { jobsite_id: "j123" } }, costcode: '#cc123gdj1', start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), total_break_time: 1.01, duration: 6.00, timesheet_comments: 'No issues during the shift.', app_comment: 'Submitted on time.', user: { connect: { id: "1" } } },
{ submit_date: new Date(), date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), jobsite: { connect: { jobsite_id: "j123" } }, costcode: '#cc123gdj1', start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), end_time: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(), total_break_time: 0.00, duration: 4.00, timesheet_comments: 'No issues during the shift.', app_comment: 'Submitted on time.', user: { connect: { id: "1" } } }
];

// intaializing crew
export const initialCrews: Prisma.CrewCreateInput[] = [
{ name: "Jessica's Crew", description: "General Contrator Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Devun's Crew", description: "A Computer Science and App development Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Dustin's Crew", description: "Trucking Crew", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Seth's Crew", description: "Fabrication Crew", createdAt: new Date(), updatedAt: new Date(),},
];

// initializing crew members
export const initialCrewMembers: Prisma.CrewMemberCreateInput[] = [
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "1"}}, crew: {connect: {id: 1}}, supervisor: true },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "7"}}, crew: {connect: {id: 2}}, supervisor: true },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "8"}}, crew: {connect: {id: 2}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "9"}}, crew: {connect: {id: 2}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "2"}}, crew: {connect: {id: 1}}, supervisor: false },
{ createdAt: new Date(), updatedAt: new Date(), user: { connect: {id: "3"}}, crew: {connect: {id: 1}},  supervisor: false },
];

// creating train courses here:
export const initialTrainings: Prisma.TrainingsCreateInput[] = [
{ name: "Training 1", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Training 2", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Training 3", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),}, 
{ name: "Training 4", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),},
{ name: "Training 5", description: "Training 1 description", createdAt: new Date(), updatedAt: new Date(),},  
];

// creating training courses here:
export const UserTrainings: Prisma.UserTrainingsCreateInput[] = [
{ "completed_trainings": 1, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "1" } }, "trainings": { "completed": [1], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 5, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "2" } }, "trainings": { "completed": [1, 2, 3, 4, 5], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 3, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "3" } }, "trainings": { "completed": [1, 2, 3], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 2, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "4" } }, "trainings": { "completed": [1, 3], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 1, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "5" } }, "trainings": { "completed": [4], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 0, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "6" } }, "trainings": { "completed": [], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 0, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "7" } }, "trainings": { "completed": [], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 0, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "8" } }, "trainings": { "completed": [], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
{ "completed_trainings": 0, "assigned_trainings": 10, "completion": true, "User": { "connect": {"id": "9" } }, "trainings": { "completed": [], "assigned": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }},
];

// initializing users
export const initialUsers: Prisma.UserCreateInput[] = [
{ "id": "1", "firstName": "Jessica", "lastName": "Rabbit", "username": "jessicarabbit", "password": "securepassword", "DOB" : "01-01-2000" , "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "jessicarabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"},
{ "id": "2", "firstName": "John", "lastName": "Doe", "username": "johndoe", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "johndoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"},
{ "id": "3", "firstName": "Jane", "lastName": "Doe", "username": "janedoe", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "janedoe@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"},
{ "id": "4", "firstName": "Buggs", "lastName": "Bunny", "username": "buggsbunny", "password": "securepassword", "DOB" : "01-01-2000",  "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "buggsbunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  },
{ "id": "5", "firstName": "Lola", "lastName": "Bunny", "username": "lolabunny", "password": "securepassword", "DOB" : "01-01-2000",  "truck_view": true, "tasco_view": true, "labor_view": false, "mechanic_view": false, "permission": "USER", "email": "lolabunny@example.com", "emailVerified": "2021-06-01T00:00:00.000Z", "phone": "987-654-3210", "image": "https://example.com/image.jpg"  },
{ "id": "6", "firstName": "Roger", "lastName": "Rabbit", "username": "rogerrabbit", "password": "securepassword", "DOB" : "01-01-2000", "truck_view": true, "tasco_view": false, "labor_view": true, "mechanic_view": false, "permission": "ADMIN", "email": "rogerrabbit@example.com", "emailVerified": "2022-01-01T00:00:00.000Z", "phone": "123-456-7890", "image": "https://example.com/image.jpg"},
{ "id": "7", "firstName": "Devun", "lastName": "Durst", "username": "devunfox", "password": "securepassword", "DOB": "07-08-1999", "truck_view": true, "tasco_view": true, "labor_view": true, "mechanic_view": true, "permission": "SUPERADMIN", "email": "DevunDurst@example.com", "emailVerified": "2024-05-02T00:00:00.000Z", "phone": "936-230-7110", "image": "https://example.com/image.jpg"},
{ "id": "8", "firstName": "Zachary", "lastName": "Robker", "username": "zrobker", "password": "securepassword", "DOB": "12-22-1996", "truck_view": true, "tasco_view": true, "labor_view": true, "mechanic_view": true, "permission": "SUPERADMIN", "email": "zrobker@example.com", "emailVerified": "2024-05-02T00:00:00.000Z", "phone": "724-470-4374", "image": "https://example.com/image.jpg"},
{ "id": "9", "firstName": "Sean", "lastName": "walker", "username": "seanwalk", "password": "securepassword", "DOB": "06-15-2000", "truck_view": true, "tasco_view": true, "labor_view": true, "mechanic_view": true, "permission": "SUPERADMIN", "email": "seanwalk@example.com", "emailVerified": "2024-05-02T00:00:00.000Z", "phone": "208-243-6992", "image": "https://example.com/image.jpg"}
];

// initializing contacts
export const initialContacts: Prisma.ContactCreateInput[] = [
{ "phone_number": "123-456-7890", "email": "jessica.rabbit@example.com", "emergency_contact": "Roger Rabbit", "emergency_contact_no": "098-765-4321", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "john.doe@example.com", "emergency_contact": "Jane Doe", "emergency_contact_no": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "jane.doe@example.com", "emergency_contact": "John Doe", "emergency_contact_no": "123-456-7890", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "phone_number": "183-416-7890", "email": "buggsbunny@example.com", "emergency_contact": "Lola Bunny", "emergency_contact_no": "218-765-4021", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "lolabunny@example.com", "emergency_contact": "Buggs Bunny", "emergency_contact_no": "098-745-4121", "createdAt": "2022-01-01T00:00:00.000Z", "updatedAt": "2022-01-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "jessica.rabbit@example.com", "emergency_contact": "Jessica Rabbit", "emergency_contact_no": "098-765-4321", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "wife.@example.com", "emergency_contact": "your wife", "emergency_contact_no": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "wife.@example.com", "emergency_contact": "your wife", "emergency_contact_no": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
{ "phone_number": "987-654-3210", "email": "wife.@example.com", "emergency_contact": "your wife", "emergency_contact_no": "218-765-4311", "createdAt": "2021-06-01T00:00:00.000Z", "updatedAt": "2021-06-01T00:00:00.000Z"},
]
// initializing cost codes
export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
  {
      cost_code: "#cc123gdj1",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "1.0 Earthwork",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "#cc123gdj2",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "2.0 Foundation",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "#cc123gdj3",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "3.0 Concrete",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "#cc123gdj4",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "4.0 Masonry",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj5",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "5.0 Structural Steel",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj6",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "6.0 Carpentry",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj7",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "7.0 Roofing",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj8",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "8.0 Windows and Doors",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj9",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "9.0 Drywall",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj10",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "10.0 Flooring",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj11",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "11.0 Painting",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj12",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "12.0 Plumbing",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj13",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "13.0 HVAC",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj14",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "14.0 Electrical",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj15",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "15.0 Landscaping",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj16",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "16.0 Site Utilities",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj17",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "17.0 Fire Protection",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj18",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "18.0 Elevator",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj19",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "19.0 Security",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  },
  {
      cost_code: "cc123gdj20",
      createdAt: new Date(),
      updatedAt: new Date(),
      cost_code_description: "20.0 Finishes",
      cost_code_type: "",
      Jobsite: {
          connect: [
              { jobsite_id: "j123" },
              { jobsite_id: "j234" },
              { jobsite_id: "j345" },
              { jobsite_id: "j456" },
              { jobsite_id: "j567" }
          ]
      }
  }
];

export const initialCrewJobsites: Prisma.CrewJobsiteCreateInput[] = [
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 1}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 2}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 4}}, jobsite: { connect: { jobsite_id: "j123"}}},
    { createdAt: "2022-01-01T00:00:00.000Z", updatedAt: "2022-01-01T00:00:00.000Z", crew: { connect: {id: 3}}, jobsite: { connect: { jobsite_id: "j123"}}}
]

export const intialEquipment: Prisma.EquipmentCreateInput[] = [

    {
        qr_id: "EQ-123456",
        name: "Excavator 3000",
        description: "Heavy-duty excavator for construction sites",
        status: "PENDING",
        equipment_tag: "EQUIPMENT",
        last_inspection: new Date("2023-06-15T00:00:00.000Z"),
        last_repair: new Date("2023-05-10T00:00:00.000Z"),
        createdAt: new Date("2024-07-25T00:00:00.000Z"),
        updatedAt: new Date("2024-07-25T00:00:00.000Z"),
        make: "Caterpillar",
        model: "CAT3000",
        year: "2020",
        license_plate: "PLT123",
        registration_expiration: new Date("2021-01-20T00:00:00.000Z"),
        mileage: 1200,
        is_active: true
      },
      {
        qr_id: "EQ-654321",
        name: "Trailer TX200",
        description: "Utility trailer for transporting equipment",
        status: "PENDING",
        equipment_tag: "TRAILER",
        last_inspection: new Date("2023-03-20T00:00:00.000Z"),
        last_repair: null,
        createdAt: new Date("2024-07-25T00:00:00.000Z"),
        updatedAt: new Date("2024-07-25T00:00:00.000Z"),
        make: "BigTex",
        model: "TX200",
        year: "2018",
        license_plate: "TRL456",
        registration_expiration: new Date("2018-05-30T00:00:00.000Z"),
        mileage: null,
        is_active: true
      },
      {
        qr_id: "EQ-789012",
        name: "Bulldozer B450",
        description: "Powerful bulldozer for heavy-duty tasks",
        status: "PENDING",
        equipment_tag: "VEHICLE",
        last_inspection: new Date("2023-02-10T00:00:00.000Z"),
        last_repair: new Date("2023-01-05T00:00:00.000Z"),
        createdAt: new Date("2024-07-25T00:00:00.000Z"),
        updatedAt: new Date("2024-07-25T00:00:00.000Z"),
        make: "Komatsu",
        model: "B450",
        year: "2019",
        license_plate: "BDZ789",
        registration_expiration: new Date("2019-06-25T00:00:00.000Z"),
        mileage: 800,
        is_active: true
      }
]

export const intialEmployeeEquipment: Prisma.EmployeeEquipmentLogCreateInput[] = [
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: { connect: { id: "1" } },
        start_time: new Date(),
        Job: { connect: { jobsite_id: "j123" } },
        Equipment: { connect: { qr_id: "EQ-123456" } },
        end_time: null,
        duration: null,
        equipment_notes: null,
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: { connect: { id: "2" } },
        start_time: new Date(),
        Job: { connect: { jobsite_id: "j123" } },
        Equipment: { connect: { qr_id: "EQ-654321" } },
        end_time: null,
        duration: null,
        equipment_notes: null,
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: { connect: { id: "3" } },
        start_time: new Date(),
        Job: { connect: { jobsite_id: "j123" } },
        Equipment: { connect: { qr_id: "EQ-789012" } },
        end_time: null,
        duration: null,
        equipment_notes: null,
      }
    ];
