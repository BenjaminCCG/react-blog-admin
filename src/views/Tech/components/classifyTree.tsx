import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Modal, Tree, message } from 'antd';
import { queryTypeList, saveType, deleteType, updateType } from '@/network/api/api';
import { ArticleType } from '@/network/api/api-params-moudle';
import { useSetState, useMount } from 'react-use';
import { useBusinessStore } from '@/store/business';
import { DataNode } from 'antd/es/tree';
import styles from './index.module.scss';
export default function ClassifyTree() {
  const { typeList, setTypeList } = useBusinessStore();
  const formRef = useRef<FormInstance>(null);
  const [modal, setModal] = useSetState({
    type: 'add',
    data: {},
    show: false
  });
  // const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
  //   console.log('selected', selectedKeys, info);
  // };
  const fetchTypeList = () => {
    queryTypeList({}).then((res) => {
      setTypeList(res);
    });
  };

  const handleOk = () => {
    const params = formRef.current?.getFieldsValue();

    const func = modal.type === 'add' ? saveType : updateType;
    const data = modal.type === 'add' ? params : { ...modal.data, ...params };
    func(data).then(() => {
      message.success('操作成功');
      setModal({ show: false });
      fetchTypeList();
    });
  };

  const editClick = (node: ArticleType) => {
    setModal({
      show: true,
      type: 'edit',
      data: node
    });
    setTimeout(() => {
      formRef.current?.setFieldsValue(node);
    });
  };

  const deleteClick = async (node: ArticleType) => {
    await deleteType(node.id!);
    message.success('删除成功');
    fetchTypeList();
  };
  useMount(() => {
    fetchTypeList();
  });

  useEffect(() => {
    if (!modal.show) {
      formRef.current?.resetFields();
    }
  }, [modal.show]);
  return (
    <>
      <Button type="primary" className="mb-4" onClick={() => setModal({ show: true, type: 'add' })}>
        新增分类
      </Button>
      <Tree
        className={styles.tree}
        titleRender={(node: any) => {
          return (
            <div className="flex justify-between" key={node.key}>
              <span>{node.name}</span>
              <div className="mr-4">
                <EditOutlined className="mr-4" onClick={() => editClick(node)} />
                <DeleteOutlined onClick={() => deleteClick(node)} />
              </div>
            </div>
          );
        }}
        treeData={typeList as DataNode[]}
        fieldNames={{
          title: 'name',
          key: 'id'
        }}
      />
      <Modal title="分类" open={modal.show} onOk={handleOk} onCancel={() => setModal({ show: false })}>
        <Form labelCol={{ span: 4 }} className="w-full" ref={formRef} wrapperCol={{ span: 22 }} layout="horizontal">
          <Form.Item label="分类名称" name="name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
