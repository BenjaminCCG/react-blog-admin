import React from 'react';
import { Upload, message } from 'antd';
import { RcFile, UploadChangeParam, UploadProps, UploadFile as UF } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const UploadFile = forwardRef((_, ref) => {
  const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/file/upload';
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
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
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UF>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.data.url);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      imageUrl,
      setImageUrl,
      setLoading
    };
  });
  return (
    <ImgCrop quality={1} aspect={2.29 / 1}>
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </ImgCrop>
  );
});

export default UploadFile;
