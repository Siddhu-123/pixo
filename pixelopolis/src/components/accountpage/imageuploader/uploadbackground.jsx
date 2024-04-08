import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Uploadback({address1}) {
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [user,setuser] = useState([]);
  const [image1, setImage1] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage1(file);
    }
  };
  const openFilePicker = () => {
    const fileInput = document.getElementById('fileInput1');
    fileInput.click();
  };
  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      if (!image1) {
        console.error('No image selected');
        return;
      }
      const formData = {
        id : address1,
        image: image1.name,
      };
      const response = await axios.post('http://localhost:5000/userbackimage', formData);
      console.log('Response:', response.data);
      handleimageupload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  if(image1){  
    handleSubmit();
  }
  const handleimageupload = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const formData = new FormData();
    formData.append("image", image1);
    try {
      await axios.post("http://localhost:5000/uploadbackgroundimage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Background image uploaded successfully");
    } catch (error) {
        console.error("Error uploading image:", error);
    }
  };
  useEffect(() => {
    axios.get('http://localhost:5000/userinfo')
      .then(response => {
        const backgroundImage = response.data.data;
        backgroundImage.forEach(user => {
          if (user._id === address1) {
            setuser(user);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching background image:', error);
      });
  }, [axios,address1]);
  useEffect(() => {    
    if(user){
      setSelectedImage1(user.backgroundimage);
    }
  }, [user]);
  return (
    <>
      <div className="backout" onClick={openFilePicker}>
        {selectedImage1 ? (
          <div className="collprofilebackimage">
              <img className="blurpic" src={require(`../../../image/user/${selectedImage1}`)}  alt="background" />
              <img className="actualpic" src={require(`../../../image/user/${selectedImage1}`)}  alt="background" />
          </div>
        ) : (
          <h1>Please upload a background image</h1>
        )}
      </div>
      <input type="file" accept="image/*" id="fileInput1" style={{ display: 'none' }} onChange={handleImageChange}/>
    </>
  );
}

export default Uploadback;
