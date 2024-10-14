"use client";

import { Restaurant } from "@prisma/client";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Select, DatePicker, TimePicker } from "antd";

export default function EventCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
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
          name={["restaurantIds"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select mode="multiple" {...restaurantSelectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
}
