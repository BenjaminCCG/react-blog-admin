import React from 'react';
import { useUpload } from './useUpload';
import { fileUpload } from '@/network/api/api';
import { Upload, message } from 'antd';
import { RcFile, UploadFile as UF } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export default function UploadFile() {
  const [loading] = useState(false);
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const { fileList, setFileList } = useUpload();
  const handleChange = ({ fileList }: { fileList: UF[] }) => {
    console.log(fileList, 'fileList');
    setFileList(fileList);

    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   getImageUrl(info.file.response.data.url);
    //   setImageUrl(info.file.response.data.url);
    // }
  };

  function handleRemove(file: any) {
    // 移除文件
    setFileList((prevFileList) => prevFileList.filter((item) => item.uid !== file.uid));
  }
  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const form = new FormData();
    form.append('file', file);
    try {
      // const res = await uploadFileChunk(file)
      const res = await fileUpload(form);
      onSuccess(res, file);
      message.success('文件上传成功');
    } catch (error) {
      onError(error);
      message.error('文件上传失败');
    }
    // const file = {
    //   uid: options.file.uid,
    //   name: options.file.name,
    //   url: res.url
    // };
    // console.log(file, 'options.file');

    // setFileList((fileList) => [...fileList, file]);
  };

  useEffect(() => {
    setFileList((fileList) => [
      ...fileList
      // {
      //   uid: 'rc-upload-1693300905585-2',
      //   name: '9fee4236-4e82-4405-bece-aa48de481053.png',
      //   url: 'https://cc-blog-admin.oss-cn-beijing.aliyuncs.com/image/2023-08-29/f1742dba-74df-4bd0-8e22-0bb57bf6e7a8.png'
      // }
    ]);
  }, []);
  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        fileList={fileList}
        onRemove={handleRemove}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {uploadButton}
        {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
      </Upload>
    </>
  );
}
