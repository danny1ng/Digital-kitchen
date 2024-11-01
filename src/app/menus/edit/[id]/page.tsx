"use client";

import { MenusGroup } from "@app/menus/_components/menus";
import { Menu, MenuGroup, MenuItem } from "@prisma/client";
import { Edit, useForm, useSelect } from "@refinedev/antd";

import { Flex, Form, Input, InputNumber, Select } from "antd";
import { useCallback } from "react";

export default function MenuEdit() {
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
  } = useForm<Menu & { items: (MenuGroup & { items: MenuItem[] })[] }>({
    queryOptions: {
      select: ({ data }) =>
        ({
          data: {
            ...data,
            items: data.items.map((group) => ({
              ...group,
              items: group.items.map((menuItem) => ({
                ...menuItem,
                image: menuItem.image ? [{ thumbUrl: menuItem.image }] : [],
              })),
            })),
          },
        } as any),
    },
  });

  const data = queryResult?.data?.data;

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
    defaultValue: data?.restaurantId || "",
  });
  const onFinish = useCallback((values: any) => {
    const formattedValues = {
      ...values,
      items: values.items.map((group: any) => ({
        ...group,
        items: group.items.map((menuItem: any) => ({
          ...menuItem,
          image: menuItem?.image?.[0]?.response,
        })),
      })),
    };
    return formProps?.onFinish?.(formattedValues);
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" size="large" onFinish={onFinish}>
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
                required: false,
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
                required: true,
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
    </Edit>
  );
}
