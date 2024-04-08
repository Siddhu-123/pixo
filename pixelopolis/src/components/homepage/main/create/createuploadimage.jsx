import React, { useState } from 'react';

function Createuploadimage({ onImageSelect}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageSelect(file);
    }
  };
  // console.log(selectedImage);
  const close = () => {
    setSelectedImage(null);
  };

  const openFilePicker = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  };
  return (
    <div className="createimageinsert">
      {selectedImage ? (
        <div className='createuploadedfile'>
          <img src={selectedImage} alt="Selected Image" />
          <p onClick={close}>&#10006;</p>
        </div>
      ) : (
        <div className='createuploadfile'>
          <p>PNG, GIF, JPEG, SVG. Max 10mb.</p>
          <button type="button" onClick={openFilePicker} required>Choose file</button>
        </div>
      )}
      <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange}/>
    </div>
  );
}

export default Createuploadimage;