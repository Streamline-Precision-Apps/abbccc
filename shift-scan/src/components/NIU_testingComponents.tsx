"use server";
import { LogoutButton } from "@/app/api/auth";
import { Buttons } from "./(reusable)/buttons";
/* This button displays the login and logout buttons are testcases
    for the login and logout functionality and to view user permissions 
    and we will reassign the buttons to different parts of the app */
export default async function TestingComponents() {
  return (
    <div className="flex flex-row space-x-10 justify-center">
      <Buttons href="/signin">Login</Buttons>
      <LogoutButton />
    </div>
  );
}
