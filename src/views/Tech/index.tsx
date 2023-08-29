import React from 'react';
import { Space, Table, Button, Modal, FormInstance, message } from 'antd';
import { Form, Input, Select } from 'antd';
import { Col, Row } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import UploadFile from '@/components/UploadFile';
import ClassifyTree from './components/classifyTree';
import { fileUpload, queryArticlePage, saveArticle, updateArticle, deleteArticle } from '@/network/api/api';
import { Article, ArticleType } from '@/network/api/api-params-moudle';
import { useBusinessStore } from '@/store/business';
import { useSetState, useMount } from 'react-use';

export default function Tech() {
  const { typeList } = useBusinessStore();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useSetState({
    type: 'add',
    data: {},
    show: false
  });
  const uploadRef = useRef<{
    imageUrl: string;
    setImageUrl: (url: string) => void;
    setLoading: (loading: boolean) => void;
  }>(null);

  const formRef = useRef<FormInstance>(null);
  const [text, setText] = useState('');
  const searchForm = {
    pageNum: 1,
    pageSize: 10
  };
  const [articleList, setArticleList] = useState<Article[]>([]);

  const fetchArticleList = () => {
    setLoading(true);
    queryArticlePage(searchForm).then((res) => {
      setLoading(false);
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
      uploadRef.current?.setImageUrl(record.cover!);
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
      key: 'typeId',
      render(text) {
        return <span>{(typeList as ArticleType[])?.find((i) => i.id === text)?.name}</span>;
      }
    },
    {
      title: '简介',
      dataIndex: 'intro',
      key: 'intro',
      ellipsis: true
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
    console.log(uploadRef.current, 'xxx');

    const params = {
      ...formRef.current?.getFieldsValue(),
      content: text,
      cover: uploadRef.current!.imageUrl
    };
    const func = modal.type === 'add' ? saveArticle : updateArticle;
    const data = modal.type === 'add' ? params : { ...modal.data, ...params };
    func(data).then(() => {
      message.success('操作成功');
      setModal({ show: false });
      fetchArticleList();
    });
  };

  useMount(() => {
    fetchArticleList();
  });
  useEffect(() => {
    if (!modal.show) {
      formRef.current?.resetFields();
      setText('');
      uploadRef.current?.setLoading(false);
      uploadRef.current?.setImageUrl('');
    }
  }, [modal.show]);

  const onUploadImg = async (files: File[], callback: (url: string[]) => void) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);

          fileUpload(form)
            .then((res) => {
              rev(res);
            })
            .catch((err) => {
              rej(err);
            });
        });
      })
    );

    callback(res.map((item: any) => item.url));
  };
  return (
    <>
      <Row>
        <Col span={4}>
          <ClassifyTree />
        </Col>
        <Col span={18}>
          <Button type="primary" onClick={fetchArticleList}>
            查询
          </Button>
          <Button type="primary" onClick={() => setModal({ show: true, type: 'add' })}>
            新增
          </Button>
          <Table columns={columns} loading={loading} dataSource={articleList} rowKey="id" />
        </Col>
      </Row>

      <Modal
        title="技术"
        width={1200}
        cancelText="取消"
        okText="提交"
        open={modal.show}
        onOk={handleOk}
        maskClosable={false}
        keyboard={false}
        onCancel={() => setModal({ show: false })}
      >
        <Form labelCol={{ span: 2 }} className="w-full" ref={formRef} wrapperCol={{ span: 22 }} layout="horizontal">
          <Form.Item label="标题" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="分类" name="typeId">
            <Select options={typeList} fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label="封面">
            <UploadFile ref={uploadRef}></UploadFile>
          </Form.Item>
          <Form.Item label="简介" name="intro">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="内容">
            <MdEditor modelValue={text} onChange={setText} onUploadImg={onUploadImg} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
