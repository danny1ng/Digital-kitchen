"use client";

import { Menu, MenuGroup, MenuItem } from "@prisma/client";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Select, InputNumber } from "antd";

import { MenusGroup } from "../_components/menus";

export default function MenuCreate() {
  const { formProps, saveButtonProps } = useForm<
    Menu & { items: (MenuGroup & { item: MenuItem })[] }
  >({
    defaultFormValues: {
      items: [{ items: [{}] }] as any[],
    },
  });

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" size="large">
        <Form.Item
          label="Name"
          name={["name"]}
          rules={[
            {
              required: true,
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Flex gap={24}>
          <Form.Item
            label="Position"
            name={["position"]}
            style={{ width: "50%" }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label={"Restaurant"}
            name={["restaurantId"]}
            style={{ width: "50%" }}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              {...restaurantSelectProps}
              onBlur={() => restaurantSelectProps?.onSearch?.("")}
              allowClear
            />
          </Form.Item>
        </Flex>
        <MenusGroup />
      </Form>
    </Create>
  );
}
