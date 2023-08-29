import React from 'react';
import { getUploadId, chunkUpload, completeUpload } from '@/network/api/api';
import UploadFile from '@/components/UploadFile';
function About() {
  // TS中DOM event的类型
  const handleChange = async (e: any) => {
    const chunkSize = 1 * 1024 * 1024; // 1MB
    const file = e.target.files[0];
    const fileSize = file.size;
    const form = new FormData();
    form.append('file', file);
    const res = await getUploadId(form);
    const { uploadId, fileName } = res;
    const totalChunks = Math.ceil(fileSize / chunkSize);
    const chunkList = [];
    // 上传文件分片
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;

      const chunk = file.slice(start, end); // 切割分片

      // 创建FormData对象，用于传输分片数据
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('uploadId', uploadId);
      formData.append('fileName', fileName);
      formData.append('partNumber', (i + 1) as any);
      chunkList.push(chunkUpload(formData));
    }
    const partETags = (await Promise.all(chunkList)) as string[];
    const params = {
      uploadId,
      fileName,
      partETags
    };
    completeUpload(params).then((url) => {
      return url;
    });
  };

  return (
    <div>
      <UploadFile></UploadFile>
      <input type="file" onChange={handleChange} />
    </div>
  );
}

export default About;
