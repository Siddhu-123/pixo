import React, { useState } from 'react';

function Collectionuploadimage({imagepath}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      imagepath(file);
    }
  };
  const close = () => {
      setSelectedImage(null);
  };
  const openFilePicker = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  };

  return (
    <div className="collectionimageinsert">
        {selectedImage ? (
          <div className='collectionuploadedfile'>
          <img src={selectedImage} alt="Selected Image" />
          <p onClick={close}>&#10006;</p>
          </div>
        ) : (
          <div className='collectionuploadfile'>
          <p>JPEG, PNG, GIF, SVG. Max 10mb.</p>
          <button type="button" onClick={openFilePicker}>Choose file</button>
          </div>
        )}
      <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange}/>
    </div>
  );
}

export default Collectionuploadimage;