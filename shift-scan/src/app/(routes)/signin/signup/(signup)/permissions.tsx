import React from "react";
import RequestPermissions from "@/app/(routes)/signin/signup/(signup)/requestPermissions";
import { finishUserSetup } from "@/actions/userActions";

const Permissions = ({
  id,
  handleAccept,
}: {
  id: string;
  handleAccept: any;
}) => {
  const handleProceed = () => {
    finishUserSetup(id);
    handleAccept();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>
        Except the following terms and conditions to enable access to the
        application
      </p>

      <div style={{ margin: "40px 0", fontWeight: "bold", fontSize: "24px" }}>
        <p>Location,</p>
        <p>cookies,</p>
        <p>camera access</p>
      </div>

      <RequestPermissions handlePermissionsGranted={handleProceed} />
    </div>
  );
};

export default Permissions;
