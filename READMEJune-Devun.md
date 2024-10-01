6/24/2024
To put a pin on where we are in the project we are working on the first page of the application as far as the logic is concern as approaching the end of basic logic with out test cases so. Zack has been working on the settings section of the application and getting the components of the app consistent and reusable for later pages. Since a lot of the pages have similar button we are able to reuse them so its taking a bit longer to do that, Sean is currently working on a flow chart for the system along with the variable, Currently Im working on the homepage and am currently shrink my code of redundancy and looking for potential app breaking errors. 

Packages that I am including as of today:
I am adding a package called recharts to be able to visualize our hour data that will bedisplayed for empoyee and later on will use it for the dashboard app. I choose recharts because it is very powerful and simplictic to uses making only one cart for the app will be enough.

"""
npm install recharts
"""

6/25/2024
Today I have the Goal To learn more about RESTful APIs in order to send and recieve data from prisma. The steps that I am taking are:
1. research RESTful API
2. Researching NextJS app router Restful Api
3. Prisma Rest API and how to use them with the app routing system.

The reasoning, we have data that we wnt to insert into the db and also into prisma and make api calls to recieve it fo rthe app. I want to make sure that everything loads server side rather then client side. I also need to know how parents and child respond. 
I am also helping Sean with the last steps of set up for the app. 

I will report back my findings at the end of my day.

To wrap up my day I learned alot about api in next js which was useful but is till have to figure out how and when to use server side and when not, plus the documentation I have is new so server side rendering is out of data and lots of the resources say to do that which is ironic. I also felt pretty accomplished minus the little setbacks. 

6/26/2024

Today I got a video on how to use api End points in our stack, I am excited to get it working! Goal is to make a api endpoint for the user nd use them/ save them on render. I also had finished connection of the colors we will use in the app and have styled them accordingly. 

6/27/2024
Spent most of the day styling the front page to have it presentable and not horrible to look at, I was very happy with the design for now. I also focused on styling my data analytics.

6/28/2024

Today I went through more of the styling for the clockin route, created the starts of a 404 page error, I also started to create a job route for thoses who took the link from a failed qr attempt to clock in. This fail safe will look almost identical to the other component of clock/costcodes so i need to coordinate with sean on his changes. 

6/29/2024
meet with professor and diascussed what plans, I have looking forward and how the general direction of the project is he stated that we are in the right dirrection and that he like what he has seen as far as component size and all that. I also looked briefly through one of the other processes and felt that I needed more there so I will touch back up on monday with that problem which was a mobile screen tailwind adjustment.

7/1/2024
Today I am redialing in on the sprint goals and what should be achieved this week I look to do a push each monday so we will do that. I look to implement the second signin option and the counter that it will need in order to get a jobsite not via a qr code but still have that auth step to continue forward. I will report back at the end of the day. Today's review: I created a serverside finished product that pulls from the database the team page and search by the team sthey are assigned too. Next step is to make it client side and go from their . I am tired today so i will be leaving a bit early but it was over all really great having created the select jobs page and the MyTeamroute. 

7/9/2024
Today I am working on getting through my spint and finishing up the current task of displaying data for the manager to view and even edit of his employees. So far I learned/ studied alot about server mutations and got done with the docks. Currently I am doing well and have an idea of what I will do for the solution, It involves forms. The past few days I have also been looking at this too and figuring out what to do about the entirety of the page. Got the first sectin done happily.  I will report at the end of the day on what I have been doing. I also added a new category to equipment time to prisma so ill need to push that eventually. Add a float to the employee_equipment in prisma to enable a display called it duration. I was able to inish the server side fetch and learn how to do server call correctly. Its not pretty but its working. Okay I though I had a bug but i do not, when I reran the db it cleared my data on my users so ill just make a new one for tomorrow. 
Today I am working on getting through my spint and finishing up the current task of displaying data for the manager to view and even edit of his employees. So far I learned/ studied alot about server mutations and got done with the docks. Currently I am doing well and have an idea of what I will do for the solution, It involves forms. The past few days I have also been looking at this too and figuring out what to do about the entirety of the page. Got the first sectin done happily.  I will report at the end of the day on what I have been doing. I also added a new category to equipment time to prisma so ill need to push that eventually. Add a float to the employee_equipment in prisma to enable a display called it duration. I was able to inish the server side fetch and learn how to do server call correctly. Its not pretty but its working. Okay I though I had a bug but i do not, when I reran the db it cleared my data on my users so ill just make a new one for tomorrow. 

7/10/2024
Today in order to add data I remade the seeding the way it needs to be to insert properly. The database is filled and necessary changes for zack and sean have been implemented. I also condensed the seeeding by puting the fake data into one file and the loops in the other. It works and I thoroughly tested it. I didnt get to doing the select data save 

7/11/2024
today spent awhile data proofing and make sure that the db2.0 is doing well. I realized that there were some errors. I then worked with sean on potential update and implentation on the app. After trial and error I found a video that solves the problems that we had. After that I altered the data so that the seed was alright. then went into teh my team and looked at ways to search the set for the edit button. As far as view Team is concerned. It is solved but needs adjustment for editing the teams hours which will take a bit

7/12/2024
finished the view team section today, all errors are gone and have a filtered option working for prisma, also worked with sean through them and mad the select handle changes rather then a button. Times are working as well. 

7/15/2024 
today made some changes to the db and worked with zack on his portion and then made some fixes to the user table

7/16/2024
got clocking in data working for only two choice because the data needs to have recollection of it in the db to be creted, this was intetionall and worked well, I made some great changes in the db and rewrote some processes that seemed nicce on paper but better when dealling with the data now. Also in corporated error handling too

7/17/2024
I was able to get the ground working going for a submission and my intial idea is to either have a dynamiclly inserted form or make the verify page one with the sucess page since they are online a message changing and the form will be there, This will also enable me to get the form pages id and save it quickly. I also have time zones implemented. I am hoping once i get this process down I can start the switch jobs process next. 

7/18/2024
finished the connection for the first timecard subbmitt waiting to meet with sean on setting up the backend and looking for ways to implement the server action. I also add our real data to be able to start test casinf it when the data is submitting t the db each and everyday. I will now look into updating the timecards of employee via managers tools. Finished up, I push no broken code: working on jobsite switch while also making a plan/path for log equipment and other qr scanning.

7/22/2024
Today I looked in to the switch jobs function and saw alot of similarities with the clock out update statement. Started working on it and got arround to almost finishing it but there was a bugg or too. I also had a final project to finish up.

7/23/24
Today I went back and got the update working i also worked with sean on fixing the bug and found that it was a return issue. Also did some database tweaking.


7/24/24
Started up on the edit button page and noticed there wasa lot at work so I had to back petal and think more about the process of getting there. Had a problem with date and time converstions that was just lovely ultimately ditch the date time local attribute and just joined together the date and time attributes and it worked way better. I got the edits working as well tommorrow i am going to go back through condense files. I also want the cost code options to be visible there with the site. 

7/25/24 
Today I have accomplished the build of the edit jobs feature, it saves to the database and also has select statements that do the same thing. Today I want to look into the log in feature and go from there. Meeting starts in 30 so I am going to read into some typescript stuff.


7/26 - 7/29
Promise I worked and got a bunch done except on the weekend, for got to report progress here. 

7/30/24
- made tweeks current software
- debugged equipment section
- made a recently used page for code
- convert the home screen to zacks model
- started on switch jobs issue/logic

7/30/24
- working on translations

8/8/24
- i am alive just havent been vigilante about placing notes currently. 

rewrote timesheet with gina from hr seeing if it works bigest problem was equipment logs. 

- model TimeSheet {
  submit_date           DateTime   @default(now())
  id                    Int        @id @default(autoincrement())
  userId                String
  date                  DateTime   @db.Date //two dates are in the accounting software, for easy conversion they are implemented here
  jobsite_id            String //Todo: needs to be equipment for mechanics 
  costcode              String
  nu                    String     @default("nu") // non union {} default
  Fp                    String     @default("fp") // field personal
  start_time            DateTime
  end_time              DateTime?
  timesheet_comments    String? // theses will be not nulled in the future, person needs to put in the comments amount of loads
  duration              Float? //called comments in the accounting software
  equipment_id          Int? //changed from vehicle to equipment
  equipment_hours       Float? // needed from view point
  starting_mileage      Int?
  ending_mileage        Int?
  miles_at_fuel         Float?
  ABCDE_Loads           Int?
  f_Loads               Int?
  left_idaho            Boolean?   @default(false)
  equipment_hauled      String?
  materials_hauled      String?
  hauled_loads_quantity Int?
  refueling_gallons     Float?
  total_break_time      Float?
  
  app_comment           String? //this is a backend ai we want to develope to do filtered comments
  status                FormStatus @default(PENDING)

  user    User    @relation(fields: [userId], references: [id])
  jobsite Jobsite @relation(fields: [jobsite_id], references: [jobsite_id])

  @@map("timesheets")
}
9/10/2024
- did my first code review got files condensed
- worked on the inbox page

10/01/2024
- updated the db to have better and more straight forward naming convention with Team.
- Updated the translations of the application
- learned more on app Architecture and the blessing of following clean code app development
- created Api endpoints for receiving data calls with a Prisma update
- debugging code that is slow and has latency due to complex queries. 