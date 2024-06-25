// this will hold all the types that will be used in the app

export type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    payPeriodHours?: string | null;
    date?: string | null;
    permission?: string | null;
    emailVerified?: string | null;
    employee_id?: number | null;
};

export type CustomSession = {
    user?: User | null;
};

