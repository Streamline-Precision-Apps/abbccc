import { LoginButton, LogoutButton } from '@/app/api/auth';
    /* This button displays the login and logout buttons are testcases
    for the login and logout functionality and to view user permissions 
    and we will reassign the buttons to different parts of the app */
    export default function TestingComponents() {
    return ( 
        <div className="flex flex-row space-x-4 justify-center">
        <LoginButton />
        <LogoutButton />
        </div>
    )
}