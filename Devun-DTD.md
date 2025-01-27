#
# January 2, 2025
### researched
- redux for 3 hr
  - dispatching react components
  - finished redux react series
- capacitor for 30 mins
  - practiced/ understood capacitor better
- Are state management necessary?
  - I wanted to question when we should have one and the negative effects of not having them in our app.
    - [I found this video on Web Dev Simplified](https://www.youtube.com/watch?v=VenLRGHx3D4)
    - he stated the following: 
      - meta framework like nextjs have a backend and frontend and you can deal with state everywhere
      - storing state in url is the direction he is going
      - no real need if all the tools we have are functioning like: 
        - Use useReducer, useContext, useState, use url, use react-hook-form
        - if these tools don't work he said to uses a state management library
- local storage can lead to sxs attacks and sensitive info can get out
- http- only cookies
```
import { cookies } from "next/headers";
...
cookies().set({
      name: "name",
      value: "x",
      httpOnly: true,
      path: "/",
    });
```

### built/created
- created a redux base for our app (1.5 hr)
- deleted redux and did research on local storage and cookies
- found that cookies are great to prevent sxs attacks (30mins)
### Trello
- update language selector (35 mins)
- Admin Build - Inbox Section (1hr)

#
# January 6, 2025 - Monday
### built/created
- 
### Trello
- Admin Build - Inbox Section (8 hours)
  - built apis and got the different pages made to display data
  - towards the end of creating an edit all section
#
# January 7, 2025 - Tuesday
### built/created
- 
### Trello
- Admin Build - Inbox Section (8 hours)
  - finished the create table
  - need to do a better protection
- Set up DNS for Resends

#
# January 8, 2025 - Wednesday
### built/created
- Admin Inbox Section
- Api for break counter 
- fixed the timer and got the component up and running
- fixing clocking and out on admins page
### Trello
- Researching GeoFencing(1 hour) 
- Adjusting the break counter (2 hours)
#
# January 9, 2025 - Thursday
### Meeting with company
- proposed new ideas for company app
- met with team to discuss things to help company understand
### built/created
- 
### Trello
- Building Pages and Resend (2 hour)
#
# January 10, 2025 - Friday
### built/created
- built the inbox section for the entire day
- debugged with Sean and built app with him 
- finished app build

### Trello
- Admin Build - Inbox Section (6 hour)
- Debugging Equipment with Sean

#
# January 13, 2025 - Monday
### researched
- research prisma new database to see how to better optimize our data pulls and schemas
### built/created
- hosting up and ready!
- Resend up and working!

### Trello
- Building Pages and Resend (4 hours)

#
# January 14, 2025 - Tuesday
### researched
- research prisma new database to see how to better optimize our data pulls and schemas
### built/created
- worked in figma on modern app design
- created base Employee interactions

### Trello
- Building Pages and Resend (4 hours)

#
# January 15, 2025 - Wednesday
### built/created
- worked in figma on modern app design
- created base Employee interactions
- created Sean a diagram for inbox on what it should have
- meet with team and discussed what to have for the meeting

#
# January 16, 2025 - thursday
### built/created
- built a power point to share with company
- company cancelled weekly meetings
- worked with Zack on figma discussed clock in progress 
- discussed effective ways to update the application
- bulit a key for zack to read about engineer view

#
# January 17, 2025 - friday
### Meeting 
- walked through and drafted with Zack (4 hour)
- cookies guides 
- why use cookies? 
- built home routes 
### Trello
- update widgets dashboard depending on role and privilege

#
# January 20, 2025 - Monday
### Built/created
- Making Data for a Way that Engineers, tasco, and Truck drivers can clock in (2 hrs)
- Clock In process made easier and able for Engineers, tasco, general, truck coming soon. (4 hours)
- debugging hours display (2 hours)


### Trello
- /clock  update base employee select to not show
- bug in hours view && / - display time to the 10th value to fix space issue

#
# January 21, 2025 - Tuesday
### Meeting
- Zach and I met with Jaxin on exported Data and Time Card integration
- Sorting Method Take 3 data sheets from assignar and sort them into compiled info
- insert by employee one at a time into view point

**Reports to add**
  - Tasco Reports - sort by DATE
    - Id, Shift type, Submmitted Date, Employee, Date Worked, Labor Type, Equipment, Loads-ABCDE, Loads-F, Materials, Start Time, End Time, screened or unscreened
  - Employee Time Sheets - Sort Reports By Employee & Date - Base Data
  - IFTA, Overweight Report - Sort Reports by Truck and date - extended
    - IFTA - information Mackenzie Asked for
    - OverWeight Report - Date, Truck Id, Operator, Equipment, Overweight Amount, Total Mileage

**Things To Follow Up On**
- Jaxin working on viewpoint imports
- Jaxin getting Reports
- tasco has 10 Cost Codes
- engineer has 1
- trucker has same as worker


### Built/created
- hours view update (2 hours)


### Trello
- bug in hours view && / - display time to the 10th value to fix space issue
- Starting the Engineer Role
- Starting the Tasco Role

#
# January 22, 2025 - Wednesday
### Built/created 
- built for my branch, made changes to help build, updated next system to have cleaner writings
- revamp for clock in logic to make experience better and smoother.

### Trello
- building and debugging problems(2 hours)
- Clock logic (6 hours)

#
# January 23, 2025 - Thursday
### Meeting
- Worked with Zach on hours component and questions regarding new design.
### Built/created 
- prevented infinite loops
- fixed bugs from yesterday
- left no new bugs
### Trello
- Clock logic (8hours)


#
# January 24, 2025 - Friday
### Meeting
- Meet with sean talked over new truck and tasco design
### Built/created 
- created boards for tasco and how it should be upon clock in
### Trello
- Clock logic (4 hours)
- Looking and reflection sprint
### Figma 
- 3 hours
- Worked on making clock In process smoother and more in one place then others
- Designed tasco and trucking with data in database.

#
# January 27, 2025 - Monday
### Research
- SCRUM Research to make more efficient and better scrums for team (1 hour)
### Figma
- finished Tasco last tweaks
- Created board for engineer up to clock In logic on organized view
### Built/created 
- working on truck clock in logic

### Trello
- Starting Truck Driving role