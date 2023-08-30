import React from 'react';
import { Space, Table, Button, Modal, FormInstance, message } from 'antd';
import { Form, Input } from 'antd';

import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import {
  // fileUpload,
  queryLifePage,
  saveLife,
  updateLife,
  deleteLife
} from '@/network/api/api';
import { Article } from '@/network/api/api-params-moudle';
import { useSetState, useMount } from 'react-use';
// import { useUpload } from '@/components/UploadFile/useUpload';
import UploadFile from '@/components/UploadFile';
import { ColumnsType } from 'antd/es/table';

export default function Life() {
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
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  const [html, setHtml] = useState('');
  const formRef = useRef<FormInstance>(null);
  const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/file/upload';
  const searchForm = {
    pageNum: 1,
    pageSize: 10
  };
  const [articleList, setArticleList] = useState<Article[]>([]);

  const fetchArticleList = () => {
    setLoading(true);
    queryLifePage(searchForm).then((res) => {
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
      uploadRef.current?.setImageUrl(record.cover!);
      setHtml(record.content!);
    });
  };

  const handleDelete = (record: Article) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该文章吗？',
      onOk() {
        deleteLife(record.id!).then(() => {
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
    const params = {
      ...formRef.current?.getFieldsValue(),
      content: html,
      cover: uploadRef.current!.imageUrl
    };
    const func = modal.type === 'add' ? saveLife : updateLife;
    const data = modal.type === 'add' ? params : { ...modal.data, ...params };
    func(data).then(() => {
      message.success('操作成功');
      setModal({ show: false });
      fetchArticleList();
    });
  };

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // const { uploadFileChunk } = useUpload();
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        fieldName: 'file',
        server: uploadUrl
        // async customUpload(file:File,insertFn:(url:string)=>void){
        //   const res = await uploadFileChunk(file)
        //   insertFn(res.url)
        // }
      },
      uploadVideo: {
        fieldName: 'file',
        server: uploadUrl,
        maxFileSize: 1024 * 1024 * 1024,
        timeout: 6000 * 1000
        // async customUpload(file: File, insertFn: (url: string) => void) {
        //   const res = await uploadFileChunk(file);
        //   insertFn(res.url);
        // }
      }
    }
  };
  useMount(() => {
    fetchArticleList();
  });
  useEffect(() => {
    if (!modal.show) {
      formRef.current?.resetFields();
      setHtml('');
      uploadRef.current?.setLoading(false);
      uploadRef.current?.setImageUrl('');
    }
  }, [modal.show]);
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <Button type="primary" onClick={fetchArticleList}>
        查询
      </Button>
      <Button type="primary" onClick={() => setModal({ show: true, type: 'add' })}>
        新增
      </Button>
      <Table columns={columns} loading={loading} dataSource={articleList} rowKey="id" />

      <Modal
        title="生活"
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
          <Form.Item label="封面">
            <UploadFile ref={uploadRef}></UploadFile>
          </Form.Item>
          <Form.Item label="简介" name="intro">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="内容">
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
              <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
              />
              <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={(editor) => setHtml(editor.getHtml())}
                mode="default"
                style={{ height: '500px', overflowY: 'hidden' }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
