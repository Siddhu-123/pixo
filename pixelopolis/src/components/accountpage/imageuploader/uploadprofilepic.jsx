import React, { useState,useEffect } from 'react';
import axios from 'axios';

function Uploadprofilepic({address2}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [user1,setuser] = useState([]);
  const [image, setImage] = useState(null);
  const handleimage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const handleprofileupload = async (e) => {
    if (e) {
        e.preventDefault();
    }
    const formData = new FormData();
    formData.append("image", image);
    try {
        await axios.post("http://localhost:5000/uploadprofileimage", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        console.error("Error uploading image:", error);
    }
  };
  const handleSubmit1 = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      if (!image) {
        console.error('No image selected');
        return;
      }
      const formData = {
        id : address2,
        image: image.name,
      };
      const response = await axios.post('http://localhost:5000/userprofileimage', formData);
      console.log('Response:', response.data);
      handleprofileupload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  if(image){
    handleSubmit1();
  }
  const openFilePicker = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  };
  useEffect(() => {
    axios.get('http://localhost:5000/userinfo')
      .then(response => {
        const profileImage = response.data.data;
        profileImage.forEach(user => {
          if (user._id === address2) {
            setuser(user);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching background image:', error);
      });
  }, [axios,address2]);
  useEffect(() => {    
    if(user1){
      setSelectedImage(user1.profileimage);
    }
  }, [user1]);
  return (
    <>
      <div className='picout' onClick={openFilePicker}>
        {selectedImage ? (
          <img src={require(`../../../image/user/${selectedImage}`)} alt="Selected Image" />
        ) : (
          <p>Upload image</p>
        )}
      </div>
      <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleimage}/>
    </>
  );
}

export default Uploadprofilepic;
