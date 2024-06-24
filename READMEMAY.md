steps I have taken so far in writing the structure
First I have formated the pages to have their own unique route
second I put minimal effort into each page by adding just a H1 tag
to talk about that page in specific. 

Started a new folder with in the repo called shift-scan
 npx create next-app


Imports and why i am using them with our app:

In this section, you'll see how we can internationalize the new app directory with the use of i18next, react-i18next and i18next-resources-to-backend.
npm install i18next react-i18next i18next-resources-to-backend
https://locize.com/blog/next-app-dir-i18n/
https://www.youtube.com/watch?v=fKaJYydim3Q



New day: picking up where I left off 5/22/24

npm install --save next react react-dom

npm install --save-dev typescript @types/react @types/node

npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-next

npm install --save-dev eslint-plugin-next

i then uninstalled node and reinstalled it and fix the error with next/babel that i was having.

I got it working, now i am making a button switch component
npm install nookies

https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing  
this is the method you must take in order to get internationalization up on next js... just follow these steps and copy and paste. 
```
npm install next-intl
```
be sure to install the package too

Updated as of 6/17/24

PS C:\Users\19362\Streamline-Precision-Timecard\shift-scan> npm list
shift-scan@0.1.0 C:\Users\19362\Streamline-Precision-Timecard\shift-scan
├── @auth/prisma-adapter@2.2.0
├── @prisma/client@5.15.0
├── @types/bcryptjs@2.4.6
├── @types/cookie@0.6.0
├── @types/js-cookie@3.0.6
├── @types/jsonwebtoken@9.0.6
├── @types/node@20.14.2
├── @types/react-dom@18.3.0
├── @types/react-modal@3.16.3
├── @types/react@18.3.3
├── @typescript-eslint/eslint-plugin@7.13.0
├── @typescript-eslint/parser@7.13.0
├── autoprefixer@10.4.19
├── bcryptjs@2.4.3
├── eslint-config-next@14.2.4
├── eslint-plugin-next@0.0.0
├── eslint@8.57.0
├── js-cookie@3.0.5
├── jsonwebtoken@9.0.2
├── next-auth@4.24.7
├── next-intl@3.15.0
├── next@14.2.4
├── nookies@2.5.2
├── postcss@8.4.38
├── prisma@5.15.0
├── qr-scanner@1.4.2
├── react-dom@18.3.1
├── react-modal@3.16.1
├── react@18.3.1
├── tailwindcss@3.4.4
├── ts-node@10.9.2
└── typescript@5.4.5

