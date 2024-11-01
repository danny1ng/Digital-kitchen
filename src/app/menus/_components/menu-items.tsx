import { Button, Collapse, Flex, Form, Input, InputNumber, Upload } from "antd";

import { CloseOutlined } from "@ant-design/icons";
import { getValueFromEvent } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";

export const MenuItems = ({ name }: { name: number }) => {
  const apiUrl = useApiUrl();
  return (
    <Form.Item label="Items">
      <Form.List name={[name, "items"]}>
        {(subFields, subOpt) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 16,
            }}
          >
            {subFields.length > 0 && (
              <Collapse
                items={subFields.map((subField) => ({
                  key: subField.key,
                  label: `Menu Item ${subField.name + 1}`,
                  extra: (
                    <CloseOutlined
                      onClick={() => {
                        subOpt.remove(subField.name);
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  ),
                  children: (
                    <>
                      <Form.Item
                        name={[subField.name, "name"]}
                        label={"Name"}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[subField.name, "description"]}
                        label={"Description"}
                        rules={[
                          {
                            required: false,
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input.TextArea rows={5} />
                      </Form.Item>
                      <Form.Item label="Image">
                        <Form.Item
                          name={[subField.name, "image"]}
                          valuePropName="fileList"
                          getValueFromEvent={getValueFromEvent}
                          noStyle
                          rules={[
                            {
                              required: false,
                            },
                          ]}
                        >
                          <Upload.Dragger
                            listType="picture-card"
                            action={`${apiUrl}/upload/media`}
                            multiple={false}
                            maxCount={1}
                          >
                            <p className="ant-upload-text">
                              Drag & drop a file in this area
                            </p>
                          </Upload.Dragger>
                        </Form.Item>
                      </Form.Item>
                      <Flex gap={24}>
                        <Form.Item
                          name={[subField.name, "basePrice"]}
                          label="Price"
                          style={{ width: "50%" }}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                          name={[subField.name, "calories"]}
                          label="Calories"
                          style={{ width: "50%" }}
                        >
                          <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                      </Flex>
                    </>
                  ),
                }))}
              />
            )}
            <Button type="dashed" onClick={() => subOpt.add()} block>
              + Add Menu Item
            </Button>
          </div>
        )}
      </Form.List>
    </Form.Item>
  );
};
