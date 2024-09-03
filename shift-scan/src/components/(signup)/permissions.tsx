import React from 'react';
import { Buttons } from '../(reusable)/buttons'; // Adjust the import path as needed
import RequestPermissions from './requestPermissions';

const Permissions = ({ handleAccept }: { handleAccept: any }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>Except the following terms and conditions to enable access to the application</p>

      <div style={{ margin: '40px 0', fontWeight: 'bold', fontSize: '24px' }}>
        <p>Location,</p>
        <p>cookies,</p>
        <p>camera access</p>
      </div>

      <RequestPermissions handlePermissionsGranted={handleAccept} />
    </div>
  );
};

export default Permissions;
