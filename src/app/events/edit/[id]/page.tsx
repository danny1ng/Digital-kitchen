"use client";

import { Event, Restaurant } from "@prisma/client";
import { Edit, useForm, useSelect } from "@refinedev/antd";

import { DatePicker, Flex, Form, Input, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";

export default function RestaurantEdit() {
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
    onFinish,
  } = useForm<Event & { restaurants: string[] }>({
    queryOptions: {
      select: ({ data }) => {
        return {
          data: {
            ...data,
            restaurants: ((data as any).restaurants as Restaurant[]).map(
              (item) => item.id
            ),
          },
        };
      },
    },
  });

  const data = queryResult?.data?.data;

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
    defaultValue: data?.restaurants || [],
  });

  const handleFinish = useCallback(({ restaurants, ...values }: any) => {
    return onFinish({ ...values, restaurantIds: restaurants });
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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
          name={["restaurants"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            mode="multiple"
            {...restaurantSelectProps}
            onBlur={() => restaurantSelectProps?.onSearch?.("")}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}
