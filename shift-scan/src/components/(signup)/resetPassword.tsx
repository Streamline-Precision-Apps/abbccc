import React, { useState } from 'react';
import { Buttons } from '../(reusable)/buttons';
import { setUserPassword } from '@/actions/userActions';
import PasswordStrengthIndicator from './passwordStrengthIndicator';

const ResetPassword = ({ id, handleNextStep }: { id: string; handleNextStep: any }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!validatePassword(newPassword)) {
      alert(
        'Password must be at least 6 characters long, contain at least 1 number, and contain at least 1 symbol.'
      );
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('password', newPassword);

    try {
      await setUserPassword(formData);
      handleNextStep(); // Move to the next step after successful submission
    } catch (error) {
      console.error('Error updating password:', error);
      alert('There was an error updating your password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Let's Reset Your password!</p>
      <p>Make a password with a minimum of 6 characters and 1 number and symbol</p>

      <div>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label>Password Strength:</label>
        <PasswordStrengthIndicator password={newPassword} />
      </div>

      <div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Buttons type="submit" variant={'default'} size={'default'}>
        Next
      </Buttons>
    </form>
  );
};

export default ResetPassword;