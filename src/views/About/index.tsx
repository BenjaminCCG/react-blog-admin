import React from 'react';
import { MdEditor } from 'md-editor-rt';
import { fileUpload, updateArticle, queryAboutMe } from '@/network/api/api';
import { useMount } from 'react-use';
import { Button, message } from 'antd';
function About() {
  // TS中DOM event的类型
  const [text, setText] = useState('');

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
  const fetchAboutMe = async () => {
    const res = await queryAboutMe();
    setText(res.content!);
  };

  const updateAboutMe = async () => {
    const params = {
      id: 99999,
      content: text
    };
    await updateArticle(params);
    message.success('更新成功');
  };
  useMount(() => {
    fetchAboutMe();
  });
  return (
    <div>
      <MdEditor modelValue={text} onChange={setText} onUploadImg={onUploadImg} className="mb-5" />
      <div className="text-center">
        <Button type="primary" onClick={updateAboutMe}>
          提交
        </Button>
      </div>
    </div>
  );
}

export default About;
