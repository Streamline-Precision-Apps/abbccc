import React, { useState } from 'react';
import { Buttons } from '../(reusable)/buttons';
import { uploadFirstImage } from '@/actions/userActions';
import CameraComponent from '../(inputs)/camera';
const ProfilePictureSetup = ({ id, handleNextStep }: { id: string; handleNextStep: any }) => {
  const [base64String, setBase64String] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitImage = async () => {
    if (!base64String) {
      alert("Please capture or select an image before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstImage(formData);
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('There was an error uploading your image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>Snap A picture of Your Face for your Profile</p>

      <div style={{ margin: '20px 0' }}>
        {/* Integrating CameraComponent */}
        <CameraComponent setBase64String={setBase64String} />
      </div>

      {/* <Buttons
        // onClick={}
        variant={'default'}
        size={'default'}
        style={{ backgroundColor: 'limegreen', color: 'black', marginBottom: '10px' }}
      >
        Camera Roll
      </Buttons> */}

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

export default ProfilePictureSetup;
