// app/upload/page.jsx

'use client';

import { SetStateAction, useState } from 'react';

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Handle file input change
  const handleFileChange = (event: { target: { files: SetStateAction<null>[]; }; }) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-image/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setResult(data.result);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to process the image.');
    }
  };

  return (
    <div>
      <h1>Upload an Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p>Result: {result}</p>}
    </div>
  );
}
