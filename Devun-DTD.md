## January 2, 2025
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
- update language selector (35mins)
- Admin Build - Inbox Section (1hr)


## January 6, 2025 - Monday
### built/created
- 
### Trello
- Admin Build - Inbox Section (8hours)
  - built apis and got the different pages made to display data
  - towards the end of creating an edit all section

## January 7, 2025 - Tuesday
### built/created
- 
### Trello
- Admin Build - Inbox Section (8)
  - finished the create table
  - need to do a better protection