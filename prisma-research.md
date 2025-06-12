# Prisma

## Prisma research notes.
- npx prisma migrate dev is a command that applies the migrations to the database.
- if you want to make a migration without applying it to the database, you can use npx prisma migrate dev --create-only.
- npx prisma db push is a command that applies the schema changes to the database without creating a migration.
- npx prisma deploy is a command that applies the migrations to the database and updates the schema on the database.
- npx prisma migrate dev --name="migration-name"
- if your migration failed, you need to run npx prisma migrate resolve --rolled-back "migration-name"  to mark the migration as rolled back.
- Migrations is not something you want to fix things from the past, but is something you want to fix things moving forward.
Pre-Production (During Development)
1. Initial Setup
bash
npm install prisma --save-dev
npx prisma init
2. Define Your Schema
Edit prisma/schema.prisma to define models, relations, enums, etc.

3. Create and Apply Migrations (Frequent during development)
bash
# After each schema change:
npx prisma migrate dev --name "init"  # For first migration
npx prisma migrate dev --name "add_user_model"  # Subsequent migrations
4. Generate Prisma Client
bash
npx prisma generate
# This happens automatically with `prisma migrate dev`
5. Reset Database (When needed)
bash
npx prisma migrate reset
6. Inspect Database
bash
npx prisma studio  # GUI to view data
npx prisma db pull  # Introspect existing DB to create schema (if starting from existing DB)
7. Seed Database (Optional)
bash
npx prisma db seed
# Configure seed script in package.json
## Post-Production (After Development Complete)
1. Create Production Migration
bash
npx prisma migrate deploy
2. Generate Production Client
bash
npx prisma generate
3. Database Maintenance Commands
bash
npx prisma migrate diff  # Compare schema changes
npx prisma db push  # Emergency schema updates (use with caution)
4. Production Environment Variables
Ensure DATABASE_URL in production environment points to production DB

Workflow Differences: Development vs Production
Development Phase:
Frequent schema changes

Use prisma migrate dev for all migrations

Database resets are common

May use db push for quick prototyping (not recommended for team projects)

Seed data often refreshed

Production Phase:
Schema changes require careful planning

Use prisma migrate deploy to apply migrations

Never use reset or db push in production

Migration rollbacks require new migration files

Data preservation is critical

Team Collaboration Best Practices
Schema Changes:

Always create a new migration file for each change

Never edit migration files directly after they've been run by teammates

Use descriptive migration names

Version Control:

Commit both schema.prisma and migration files

Do not commit the migrations folder's _journal table

Code Reviews:

Review schema changes carefully

Verify migration SQL before applying to production

Environment Management:

Maintain separate databases for dev, staging, and production

Use different .env files for each environment

Emergency Production Scenario
If you need to modify production schema urgently:

bash
# 1. Create a new migration from your local changes
npx prisma migrate dev --name "emergency_fix"

# 2. Review the generated SQL carefully

# 3. Apply to production
npx prisma migrate deploy

# 4. Generate updated client
npx prisma generate

# 5. Redeploy application
Remember that in production, all schema changes should go through proper testing in staging environments first whenever possible.

### What is Prisma?
- it is an ORM that is used to make writing databases easier and fast
- has a direct connection to the database 
    - fast at writing database queries and retrieving data
- is built upon typescript

## Prisma Schema 
What is the generator?
- it is what the code is generated into, it is the format of prisma and when you run it we take prisma code and it changes it to the selected datasource 
- the default generator is what we use 90% of the time
- you can have any amount of generators
what is a datasource?
- datasource - can only have 1 data source

other things to included in the prisma schema attributes: 

- A model must have an ID
- @id - this is the id for the model
- @default(param) - this sets an autofill for the database with a certain param
- autoincrement() - this is an option for a param within the default
- uuid() - a uniquely generated string option for the default section mainly used on primary keys
- @unique - a tag that makes a constraint that the user preference of a user only has one table linked
- @updatedAt it sets up the current field ayt a new time
- default(now()) - take sthe time on creation


## Every Fields Type
All the Field types in prisma are in relation to the database source you use, for example postgres used or has the ability to store data in the form of json. The following are Data types used in Prisma.

- boolean
- bigInt
- Int
- String
- Float -  less specific
- Decimal - represents a more accurate way
- DateTime - timestamp
- Json -only postrgres allows json
- Bytes -storing 
- Unsupported(") if it isnt supported
- An Object, this includes a relationship string with a one to main

## FieldType modifiers
These modifiers help adjust the schema to accept and or require more or less.
- [ ] - Array
- ? - optional

## One to Many
User has many-> POST
A post has 1 User 
one -> many 
```
model User {
    id String @id @default(uuid())
    name string
    email string
    posts Post[]
}

model Post{
    id String @id @default(uuid())
    rating Float 
    authorId String 
    author User @relationship(fields : [authorId], references: [id])
}

```
**In the example above the connection occurs on the authorId and the Id located in the User table** 

## Example of Two Reference on the Same Table 
User has many-> writtenPosts.

User has many -> favoritePosts.

A post can be linked to one, or both tables.


```
model User {
    id String @id @default(uuid())
    name string
    email string
    writtenPosts Post[] @relationship("writtenPosts") // all the users custom posts
    favoritePosts Post[] @relation("favoritePosts") // user has post that he has saved that are not his

}

model Post{
    id String @id @default(uuid())
    rating Float 

    authorId String 
    author User @relationship("writtenPosts", fields : [authorId], references: [id])
    
    favoriteBy User? @relation("favoritePosts", fields: [favoriteById], references:[id])
    favoriteById string? 
}

```
**In the example above the connection occurs on:**
- We used a "Keyword" to define where the particular connections occurred with the @relation() 
- the **authorId** and the **Id**
- the **favoriteById** and the **Id** located in the User table 
- the **favoriteBy** is optional
- this is an example of **disambiguating multiple relationships** on a **one to many relationship**

## Example of a Many to Many
```
model Post{
    id String @id @default(uuid())
    rating Float 

    authorId String 
    author User @relationship("writtenPosts", fields : [authorId], references: [id])
    
    favoriteBy User? @relation("favoritePosts", fields: [favoriteById], references:[id])
    favoriteById string? 
    Category[]
}

model Category{
 id String @id @default(uuid())
 post Post[]
}

```
### Why is this many to many?
- Post can have many categories
- Categories can have many Posts

### How does it connect?
**In the example above the connection occurs on:**
- **Post[]** and **Category[]**
- this automatically creates a joining table for us thanks to Prisma


## Example of a one to one relationship

```
model User {
    id String @id @default(uuid())
    name string
    email string
    isAdmin Boolean
    posts Post[]
    UserPreference UserPreference? // we are saying optional that the user receives this preference
}

model UserPreference {
    id String @id @default(uuid())
    emailUpdates boolean
    user User  @relationship(fields: [userId], references: [id])
    UserId String @unique // a preference is unique to a user
}
```
**What is shown here?** 
- we have an optional connection from the user to a preference on there account
- a unique constraint that makes only one link to the user and preference


### Block level attributes
- goes inside a curly brace

example
- @@unique([age, name])
- @@index([email])
- @@id([title, authorId]) we must have a unique title and author models

only specified values use an ENUM
enum Role{
    BASIC
    ADMIN
    EDITOR
}

#### Things to Keep in mind when working with queries

- **You can do only a select or an include you can't do both**
- If you want to see the queries add the following to the client: **const prisma = new PrismaClient({ log : [query]})**
    - it helps with debugging and seeing possible problems
- selects can not be used in create function
- @@unique can be used by prisma in find uniques the examples above of User include 
    - @id is always a unique constraint 
    - @@unique(email)
    -  @@unique([age, name]) is the reason Prisma generated a variable called age_name


# Prisma schema
```
model User {
    id string @id @default(uuid())
    age Int
    name String
    email String
    role Role @default(BASIC)
    writtenPosts Post[] @relation("writtenPosts")
    favoritePosts Post[] @relation("favoritePosts")
    userPreference UserPreference? @realtion(fields: [userPreferenceId], references: [id])
    userPreferenceId string? @unique

    @@unique([age, name])
    @@index([email])
}

model UserPreference{
    id string @id @default(uuid())
    emailUpdates Boolean
    user User?
}
```
Bases off this model we have:
- a user that has option for a certain user preference
- they have one unique connection to that model
- they must have a age, and name that don't already exist in the database, might want to change to include email


### e.g of Prisma Queries
```
#Creating Data
await prisma.user.create({
    data:{
        name:"Kyle",
        email: "kyle@test.com,
        age: 28,
        userPreference{
            create:{
                emailUpdates:true,
            }
        }
    }
    //Optional feature to add/link table to user
    include:{
        userPreference:true,
    }
})
```

# Reading Data:

### Unique constraint on Email
```
await prisma.user.findUnique({
    where:{
        email: "kyle@test.com"
    }
})
```

### Unique Constraint on age_name
```
await prisma.user.findUnique({
    where:{
        age_name:{
            age: 28,
            name: "Kyle",
        }
    }
})
```



### Finds first user with name
```
await prisma.user.findFirst({
    where:{
       name : 'sally'
    }
})
```



### Finds all Users with name 
```
await prisma.user.findMany({
    where:{
       name : 'sally'
    }
})
```

### Using Distinctness
```
await prisma.user.findMany({
    where:{
       name : 'sally'
    },

     // e.g. will only return one sally
    distinct: ["name"]

     // e.g. will only return all sally with a different Name and Age
     distinct: ["name", "age"] 
})
```
### Pagination, OrderBy, Take, Skip
```
await prisma.user.findMany({
    where:{
       name : 'sally'
    },
    orderBy{
        age: "asc" // orders age in ascending order
    }
    take: 2, // takes 2
    skip: 1, // skips the first data point that match 
})
```

### Not, In, (=),(>),(<),(>=),(<=)
```
await prisma.user.findMany({

    // returns user that are not sally 
     where:{
       name: {not :'sally'}
    },


    // returns all the users in the array of data 
     where:{
       name: {in :["Sally", "kyle"]}
    },


    // returns user equal to Sally
    where:{
       name: {equals :'sally'}
    },


     // returns all the users that are not in the array of data 
     where:{
       name: {notIn :["Sally", "kyle"]}
    },


    // Less the and greater then 
     where:{
       age:{ lt : 20} // Less Then.
       age:{ gt : 25} // Greater Then.
       age:{lte: 15} // Less Then or Equal to.
       age:{gte : 29} // Greater Then or Equal to.
    },

    // checking if it is contain throughout the email string contains
    where:{
        email : {contains : {"@test1.com"}}
    }

    // check the ending for the string
    where:{
        email : {startsWith : {"@test1.com"}}
    }

    // check the ending for the string
    where:{
        email : {endsWith : {"@test1.com"}}
    }

})
```

### Using AND, OR, NOT

#### And
```
await prisma.user.findMany({

    // returns user that are not sally 
     where:{
        AND:[
            { name: {"sally"} }
            { age: {29} }
        ]
    },
})
```

#### OR
```
await prisma.user.findMany({

    // returns user that are not sally 
     where:{
        OR:[
            { name: {"sally"} }
            { age: {29} }
        ]
    },
})
```

#### NOT
```
await prisma.user.findMany({

    // returns user that are not sally 
     where:{
        NOT:[
            { name: {"sally"} },
        ]
    },
})
```
## Reading Queries on Relationships
#### ONE TO ONE 
```
await prisma.user.findMany({

     where:{
     userPreference:{
        emailUpdates: true,
     }
    },
})
```
#### EVERY 
- every written post the user has includes **Test**
```
await prisma.user.findMany({

     where:{
      writtenPosts:{
        every: {
           title: "Test
        }
      }
    },
})
```
#### NONE
- Looking for users that **don't** have any title of **Test**

await prisma.user.findMany({

     where:{
      writtenPosts:{
        none: {
           title: "Test
        }
      }
    },
})

#### SOME
- Do any of there titles start with test?
```
await prisma.user.findMany({

     where:{
      writtenPosts:{
        some: {
           title: "Test
        }
      }
    },
})
```

#### IS / IsNot
```
await prisma.post.findMany({

     where:{
      author: {
        is :{
            age: 27,
        }
        isNot :{
            age: 28,
        }
      }
    },
})
```

# Updating Data
- Updating data allows you to change values within a table
- you can target a single value or mass covert some values. 

### Update
- e.g. updating the sally with the same email as the where
```
const user = await prisma.user.update({
    where:{
        email : "sally@test.com"
    },
    data:{
        email: "sally4@test.com"
    }
})
```
### Examples of Updating

#### Incrementing Age
- must use a unique field

```
const user = await prisma.user.update({
    where:{
       email: "kyle@test.com"
    },
    data:{
        age : {
            increment : 1
        }
        age : {
            decrement : 1
        }
        age : {
            multiple : 10
        }
        age : {
            divide : 1
        }
    }
})
```



### update many
- you **can't** use a **Select** or **Include**
- e.g. Converting all sally to a new name called "NewSally"
```
const user = await prisma.user.updateMany({
    where:{
        name: "Sally
    }
    data:{
        name:"NewSally"
    }
})
```
# Deleting Data
### Delete
- must use a unique constraint
- if none is found we will get an error
#### e.g.
```
const user = await prisma.user.delete({
    where:{
        email: "kyle@test.com
    }
})
```

### DeleteMany
#### e.g.
- this will delete all users under the age of 20
```
const user = await prisma.user.deleteMany({
    where:{
       age: {gt : 20}
    }
})

```
- this will delete all users in DB
```
const user = await prisma.user.deleteMany()
```



#### Sources
- [Learn Prisma In 60 Mins - Web Dev Simplified ](https://www.youtube.com/watch?v=RebA5J-rlwg) 