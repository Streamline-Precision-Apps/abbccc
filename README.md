# Streamline-Precision-Timecard

This is the readme for the streamline precision timecard app

# QR Installation instructions

QR Simple QR code Reader walkthrough: 
* [Here](https://medium.com/readytowork-org/implementing-a-qr-code-scanner-in-react-4c8f4e3c6f2e)

* All the necessay packages:
```
npm i qr-scanner --legacy-peer-deps

npm install @svgr/webpack --save-dev

npm install moment axios # Moment For timestamp formatting and Axios for database API interaction

next dev --experimental-https

```

Reasoning behind packages:
- all the new code written today was from there and now, i am moving towards altering the sample to make it better. 
you need to just use one extension
- npm i qr-scanner
- You will need to use typescript, src/path, tailwind, and app routing
- npm install @svgr/webpack --save-dev
this is a package that is needed to display your svg files, I then had to change the next.config,js file. Make sure to leave the " /** @type {import('next').NextConfig} */"

- another thing that I figured out was that you need to put your global/public variables into public folder and then you can acces them anywhere. Perfect for images and non-secure data to be stored.
- npm install moment axios # For timestamp formatting and database API interaction
These two modules make it easier to make Timestamps and axios for database interation. 


## Next Steps:

looking currently for an npm for hashing services to help create QR codes then decode them for an increase of difficulty in accessing them. The Idea is that we hash the code on creation and dehash it when scanning on the software. 


## Installing Prisma
- npm create next-app
  We then need to install 2 prisma packages, one for development and the other for deployment
  """
  npm install prisma --save-dev
  """
  (we just installed prisma on a development env.)
  """
  npm install @prisma/client
  """
Now we have the ability to initialize prisma:
- npx prisma init
To make a migration we write the command:
- npx prisma migrate dev -- name init
  the name init is naming the migration we did for our db
  last thing that we need to get this running properly is to use ts-node for our typescript functions
  - npm install -D ts-node
  - we will then go into the json package and write the following script for prisma to work:
    
  ![image](https://github.com/Streamline-Precision-Apps/abbccc/assets/168473625/1f476748-0cfa-4182-b2ec-eac53ec2a4b4)
```
{
  "name": "test-enviornment",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": " prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.13.0",
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "prisma": "^5.13.0",
    "tailwindcss": "^3.4.1",
    "ts-node": "^10.9.2",
    "typescript": "^5"
  }
}
```
then we need to create a seed file under the prisma folder

- we run npx prisma generate to update the building of the db structure.
- finally to create a db seed we run this command
- npx prisma db seed
- Other things to be aware of is the db that you choose. 


in prisma to make a data model you build the model into the schema.prisma file that is in your folder labeled prisma
there you need to set up your database source and also create those tables: here is an example: 
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL") // uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}

model User{
  id Int @id @default(autoincrement())
  email String @unique
  password String
  name String?
}
```




