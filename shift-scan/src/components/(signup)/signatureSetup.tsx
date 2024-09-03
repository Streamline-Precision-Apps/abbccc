import React, { useState } from 'react';
import { Buttons } from '../(reusable)/buttons';
import { uploadFirstImage, uploadFirstSignature } from '@/actions/userActions';
import CameraComponent from '../(inputs)/camera';
import Signature from './signature';
const SignatureSetup = ({ id, handleNextStep }: { id: string; handleNextStep: any }) => {
  const [base64String, setBase64String] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitImage = async () => {
    if (!base64String) {
      alert("Please capture a signature before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('Signature', base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstSignature(formData);
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error('Error uploading signature:', error);
      alert('There was an error uploading your signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>Set up personal signature. Be sure to sign it well. It will be used on every form.</p>

      <div style={{ margin: '20px 0' }}>
        {/* Integrating CameraComponent */}
        <Signature setBase64String={setBase64String} />
      </div>


      <Buttons
        onClick={handleSubmitImage}
        variant={'default'}
        size={'default'}
        style={{ backgroundColor: 'orange', color: 'black' }}
        disabled={isSubmitting} // Disable the button while submitting
      >
        {isSubmitting ? "Submitting..." : "Next"}
      </Buttons>
    </div>
  );
};

export default SignatureSetup;
