import {promises as fs} from 'fs';
export default function LoginForm() {
    return (
        <>
        <h1 className="text-center text-3xl">Login</h1>
        <div>
            <form className="background rounded shadow bg-blue-200 flex flex-col space-y-2 p-4">
                <label htmlFor="employeeID">Employee ID</label>
                <input className=" mx-auto p-2" id='employeeID' type="text" placeholder="employeeID" required  />
                <label htmlFor="password">Password</label>
                <input className=" mx-auto p-2" id='password' type="password" placeholder="Password" required/>
                <br />
                <button className=" mx-auto bg-green-400 p-3 w-60" type="submit">Login</button>
            </form>
            <div className="mx-auto p-2">
                <span className="mx-auto p-2 mg-auto">Hablas Español?</span>
                <input type="checkbox" name="isEs?" id="isEs?"/>
            </div>
        </div>
        </>
    );
}