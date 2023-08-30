import React from 'react';
import UploadFile from '@/components/UploadFile';
import { useUpload } from '@/components/UploadFile/useUpload';
function About() {
  // TS中DOM event的类型

  const { uploadFileChunk } = useUpload();
  const handleChange = async (e: any) => {
    uploadFileChunk(e.target.files[0]);
  };
  return (
    <div>
      <UploadFile></UploadFile>
      <input type="file" onChange={handleChange} />
    </div>
  );
}

export default About;
