"use client";

import { Event, Restaurant } from "@prisma/client";
import { Edit, useForm, useSelect } from "@refinedev/antd";

import { DatePicker, Flex, Form, Input, Select, TimePicker } from "antd";
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
            getValueProps={(value) => {
              return {
                value: value ? dayjs(value) : "",
              };
            }}
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
            getValueProps={(value) => {
              return {
                value: value ? dayjs(value) : "",
              };
            }}
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
          <Select
            {...restaurantSelectProps}
            onBlur={() => restaurantSelectProps?.onSearch?.("")}
            allowClear
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}
