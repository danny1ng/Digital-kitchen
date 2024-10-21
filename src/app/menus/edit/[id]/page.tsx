"use client";

import { MenusGroup } from "@app/menus/_components/menus";
import { Event, Restaurant } from "@prisma/client";
import { Edit, useForm, useSelect } from "@refinedev/antd";

import {
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";

export default function MenuEdit() {
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
  } = useForm<Event & { restaurants: string[] }>();

  const data = queryResult?.data?.data;

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
    defaultValue: data?.restaurantId || "",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
