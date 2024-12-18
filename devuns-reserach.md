# Prisma
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

other things to included in the prisma schema are: 

- A model must have an ID
- @id - this is the id for the model
- @default(param) - this sets an autofill for the database with a certain param
- autoincrement() - this is an option for a param within the default
- uuid() - a uniquely generated string option for the default section mainly used on primary keys
- @unique - a tag that makes a constraint that the user preference of a user only has one table linked

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

#### Sources
- [Learn Prisma In 60 Mins - Web Dev Simplified ](https://www.youtube.com/watch?v=RebA5J-rlwg) 