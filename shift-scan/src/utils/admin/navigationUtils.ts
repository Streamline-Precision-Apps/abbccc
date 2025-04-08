export const getActivePage = (pathname: string) => {
return {
    isPersonnelPage: pathname.includes("/admins/personnel"),
    isAssetsPage: pathname.includes("/admins/assets"),
    isReportsPage: pathname.includes("/admins/reports"),
    isHomePage: pathname === "/admins",
    isInboxPage: pathname.includes("/admins/inbox"),
};
};
