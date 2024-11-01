"use client";

import { Event, Restaurant } from "@prisma/client";
import { Edit, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";
import { useApiUrl } from "@refinedev/core";

import {
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";

export default function RestaurantEdit() {
  const {
    formProps,
    saveButtonProps,
    query: queryResult,
  } = useForm<Event & { restaurants: string[] }>({
    queryOptions: {
      select: ({ data }) =>
        ({
          data: { ...data, banner: [{ thumbUrl: data.banner }] },
        } as any),
    },
  });

  const apiUrl = useApiUrl();

  const data = queryResult?.data?.data;

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
    defaultValue: data?.restaurantId || "",
  });

  const onFinish = useCallback(({ banner, ...values }: any) => {
    const formattedBanner = banner?.[0]?.response;
    return formProps?.onFinish?.({ ...values, banner: formattedBanner });
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              whitespace: true,
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
              whitespace: true,
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
                whitespace: true,
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
    </Edit>
  );
}
