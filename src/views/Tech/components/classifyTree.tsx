import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Modal, Tree, TreeProps } from 'antd';
export default function ClassifyTree() {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<FormInstance>(null);
  const handleOk = () => {
    console.log(formRef.current?.getFieldsValue());
  };
  const treeData = [{ title: '技术文章', value: '0-0', key: '0-0' }];
  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        新增分类
      </Button>
      <Tree
        onSelect={onSelect}
        titleRender={(node) => {
          return (
            <div className="flex justify-between" key={node.key}>
              <span>{node.title}</span>
              <div className="ml-10">
                <EditOutlined className="mr-6" />
                <DeleteOutlined />
              </div>
            </div>
          );
        }}
        treeData={treeData}
      />
      <Modal title="分类" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form labelCol={{ span: 2 }} className="w-full" ref={formRef} wrapperCol={{ span: 22 }} layout="horizontal">
          <Form.Item label="分类名称" name="title">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
