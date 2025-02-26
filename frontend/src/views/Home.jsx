import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';




const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/images').then((res) => setImages(res.data));
  }, []);

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);
    axios.post('http://localhost:5000/upload', formData).then(() => {
      window.location.reload();
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <h2 className='text-2xl font-bold mb-4'>Image Uploader</h2>
      <div {...getRootProps()} className='border-2 border-dashed border-gray-400 p-6 rounded-lg cursor-pointer bg-white shadow-md'>
        <input {...getInputProps()} />
        <p className='text-gray-600'>Drag & drop an image here, or click to select</p>
      </div>
      <div className='mt-4 grid grid-cols-3 gap-4'>
        {images.map((img, index) => (
          <img key={index} src={img.url} alt='Uploaded' className='w-32 h-32 object-cover rounded-lg shadow-md' />
        ))}
      </div>
    </div>
  );
};

export default Home;
