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
finished the view team section today, all errors are gone and have a filtered option working for prisma, also worked with sean through them and mad the select handle changes rather then a button.