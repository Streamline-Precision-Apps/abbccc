export const getActivePage = (pathname: string) => {
  return {
    isPersonnelPage: pathname.includes("/admins/personnel"),
    isAssetsPage: pathname.includes("/admins/assets"),
    isRecordsPage: pathname.includes("/admins/records"),
    isHomePage: pathname === "/admins",
    isInboxPage: pathname.includes("/admins/inbox"),
  };
};
