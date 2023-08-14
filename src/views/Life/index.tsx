import React from 'react';
import { Space, Table, Button, Modal, FormInstance, message, Upload } from 'antd';
import { Form, Input } from 'antd';
// import { Col, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
  // fileUpload,
  queryArticlePage,
  saveArticle,
  updateArticle,
  deleteArticle
} from '@/network/api/api';
import { Article } from '@/network/api/api-params-moudle';
import { useSetState, useMount } from 'react-use';

export default function Life() {
  const [modal, setModal] = useSetState({
    type: 'add',
    data: {},
    show: false
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const formRef = useRef<FormInstance>(null);
  const [text, setText] = useState('');
  const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/file/upload';
  const searchForm = {
    pageNum: 1,
    pageSize: 10
  };
  const [articleList, setArticleList] = useState<Article[]>([]);

  const fetchArticleList = () => {
    queryArticlePage(searchForm).then((res) => {
      setArticleList(res.records!);
    });
  };
  const onHandle = (record: Article) => {
    setModal({
      show: true,
      type: 'edit',
      data: record
    });
    setTimeout(() => {
      formRef.current?.setFieldsValue(record);
      setText(record.content!);
      setImageUrl(record.cover!);
    });
  };

  const handleDelete = (record: Article) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该文章吗？',
      onOk() {
        deleteArticle(record.id!).then(() => {
          message.success('删除成功');
          fetchArticleList();
        });
      }
    });
  };
  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '分类',
      dataIndex: 'typeId',
      key: 'typeId'
    },
    {
      title: '简介',
      dataIndex: 'intro',
      key: 'intro'
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
          <Button type="link" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];
  const handleOk = () => {
    const params = {
      ...formRef.current?.getFieldsValue(),
      content: text,
      cover: imageUrl
    };
    const func = modal.type === 'add' ? saveArticle : updateArticle;
    const data = modal.type === 'add' ? params : { ...modal.data, ...params };
    func(data).then(() => {
      message.success('操作成功');
      setModal({ show: false });
      fetchArticleList();
    });
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
      setImageUrl(info.file.response.data);
    }
  };

  useMount(() => {
    fetchArticleList();
  });
  useEffect(() => {
    if (!modal.show) {
      formRef.current?.resetFields();
      setText('');
      setImageUrl('');
    }
  }, [modal.show]);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // const onUploadImg = async (files: File[], callback: (url: string[]) => void) => {
  //   const res = await Promise.all(
  //     files.map((file) => {
  //       return new Promise((rev, rej) => {
  //         const form = new FormData();
  //         form.append('file', file);

  //         fileUpload(form)
  //           .then((res) => {
  //             rev(res);
  //           })
  //           .catch((err) => {
  //             rej(err);
  //           });
  //       });
  //     })
  //   );

  //   callback(res as string[]);
  // };
  return (
    <>
      <Button type="primary" onClick={fetchArticleList}>
        查询
      </Button>
      <Button type="primary" onClick={() => setModal({ show: true, type: 'add' })}>
        新增
      </Button>
      <Table columns={columns} dataSource={articleList} rowKey="id" />

      <Modal
        title="技术"
        width={1200}
        cancelText="取消"
        okText="提交"
        open={modal.show}
        onOk={handleOk}
        onCancel={() => setModal({ show: false })}
      >
        <Form labelCol={{ span: 2 }} className="w-full" ref={formRef} wrapperCol={{ span: 22 }} layout="horizontal">
          <Form.Item label="标题" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="封面">
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
          </Form.Item>
          <Form.Item label="简介" name="intro">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="内容"></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
