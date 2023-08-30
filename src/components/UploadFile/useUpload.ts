import { UploadFile } from 'antd';
import { getUploadId, chunkUpload, completeUpload } from '@/network/api/api';

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

export function useUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadFile = () => {};

  const uploadFileChunk = (file: File) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<{ url: string }>(async (resolve) => {
      const fileSize = file.size;
      const form = new FormData();
      form.append('fileName', file.name);
      const res = await getUploadId(form);
      const { uploadId, fileName } = res;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
      const chunkList = [];
      // 上传文件分片
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = (i + 1) * CHUNK_SIZE;

        const chunk = file.slice(start, end); // 切割分片

        // 创建FormData对象，用于传输分片数据
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('uploadId', uploadId);
        formData.append('fileName', fileName);
        formData.append('partNumber', (i + 1) as any);
        chunkList.push(chunkUpload(formData));
      }
      const partETags = await Promise.all(chunkList);
      const params = {
        uploadId,
        fileName,
        partETags
      };
      completeUpload(params).then((url) => {
        resolve(url);
      });
    });
  };
  return {
    uploadFile,
    uploadFileChunk,
    fileList,
    setFileList
  };
}
