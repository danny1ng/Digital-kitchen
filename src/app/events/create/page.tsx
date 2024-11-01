"use client";

import { Create, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";
import {
  Flex,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Upload,
} from "antd";
import { useCallback } from "react";

export default function EventCreate() {
  const apiUrl = useApiUrl();
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
  });

  const onFinish = useCallback(({ banner, ...values }: any) => {
    const formattedBanner = banner?.[0]?.response;
    return formProps?.onFinish?.({ ...values, banner: formattedBanner });
  }, []);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={"Title"}
          name={["title"]}
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
          label={"Description"}
          name="description"
          rules={[
            {
              required: true,
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
        <Flex gap={24}>
          <Form.Item
            label={"Date"}
            name={["date"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={"Time"}
            name={["time"]}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Flex>
        <Form.Item
          label={"Restaurant"}
          name={["restaurantId"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select {...restaurantSelectProps} allowClear />
        </Form.Item>
        <Form.Item label="Image">
          <Form.Item
            name="banner"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            noStyle
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/upload/media`}
              listType="picture-card"
              multiple={false}
              maxCount={1}
            >
              <p className="ant-upload-text">Drag & drop a file in this area</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
    </Create>
  );
}
