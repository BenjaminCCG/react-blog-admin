import React from 'react';
import { Space, Table, Button, Modal, FormInstance, message, Upload } from 'antd';
import { Form, Input, Select } from 'antd';
import { Col, Row } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import ClassifyTree from './components/classifyTree';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const onHandle = (record: DataType) => {
  console.log(record);
};
const columns: ColumnsType<DataType> = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '分类',
    dataIndex: 'classify',
    key: 'classify'
  },
  {
    title: '简介',
    dataIndex: 'desc',
    key: 'desc'
  },
  {
    title: '发布日期',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" onClick={() => onHandle(record)}>
          编辑
        </Button>
        <Button type="link">删除</Button>
      </Space>
    )
  }
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];
export default function Tech() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const formRef = useRef<FormInstance>(null);
  const [text, setText] = useState('hello md-editor-rt！');
  const handleOk = () => {
    const params = {
      ...formRef.current?.getFieldsValue(),
      content: text,
      cover: imageUrl
    };
    console.log(params);
  };
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Row>
        <Col span={4}>
          <ClassifyTree setIsModalOpen={setIsModalOpen} />
        </Col>
        <Col span={18}>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            新增
          </Button>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>

      <Modal
        title="技术"
        width={1200}
        cancelText="取消"
        okText="提交"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form labelCol={{ span: 2 }} className="w-full" ref={formRef} wrapperCol={{ span: 22 }} layout="horizontal">
          <Form.Item label="标题" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="分类" name="classify">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="内容">
            <MdEditor modelValue={text} onChange={setText} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
