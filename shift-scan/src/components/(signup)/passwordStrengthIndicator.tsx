import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getStrength = () => {
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    let strength = 0;

    if (password.length >= minLength) strength += 1;
    if (hasNumber.test(password)) strength += 1;
    if (hasSymbol.test(password)) strength += 1;

    return strength;
  };

  const strength = getStrength();

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return 'Too Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return 'red';
      case 1:
        return 'orange';
      case 2:
        return 'yellow';
      case 3:
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: getStrengthColor(),
          marginTop: '5px',
          borderRadius: '5px'
        }}
      />
      <p style={{ color: getStrengthColor(), marginTop: '5px' }}>
        {getStrengthLabel()}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
