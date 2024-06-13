// this page will not be accessible unless your a dashboard user.
// a process to generate a username and a temporary password will be required
const SignUpForm = () => {
    return (
        <form className="grid grid-cols-2 grid-rows-2 gap-4 shadow rounded">
            
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" />

            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />

            <label htmlFor="Phone">Phone</label>
            <input type="tel" name="Phone" id="Phone" />

            <label htmlFor="birthDate">Birth Date</label>
            <input type="date" name="birthDate" id="birthDate" />

            <label htmlFor="Privilege">Privilege</label>
            <select name="Privilege" id="Privilege">
                <option value="1">Super Admin</option>
                <option value="2">Admin</option>
                <option value="3">Manager</option>
                <option value="4">User</option>
            </select>

            <label htmlFor="truck_view">They are a truck user</label>
            <input type="checkbox" name="truck_view" id="truck_view">
            </input>

            <label htmlFor="tasco_view">They are a tasco user</label>
            <input type="checkbox" name="tasco_view" id="tasco_view">
            </input>

            <label htmlFor="labor_view">They are a general user</label>
            <input type="checkbox" name="labor_view" id="labor_view">
            </input>
            <label htmlFor="mechanic_view">They are a mechanic user</label>
            <input type="checkbox" name="mechanic_view" id="mechanic_view">
            </input>
            
            <button type="submit">Register</button>




        </form>
                );
};
export default SignUpForm;