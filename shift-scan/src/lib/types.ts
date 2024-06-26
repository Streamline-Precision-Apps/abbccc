// this will hold all the types that will be used in the app

export type User = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    permission?: string | null;

};

export type CustomSession = {
    user?: User | null;
};

