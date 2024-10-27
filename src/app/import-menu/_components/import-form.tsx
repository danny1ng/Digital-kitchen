import { useApiUrl, useCustomMutation } from "@refinedev/core";
import { Button, Checkbox, Form, FormProps, Input } from "antd";
import { useCallback } from "react";

type FieldType = {
  restaurantName: string;
  restaurantGuid: string;
  toastToken: string;
};

export const ImportForm = () => {
  const apiUrl = useApiUrl();
  const { mutateAsync, isLoading } = useCustomMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = useCallback(
    (values: FieldType) =>
      mutateAsync({
        url: `${apiUrl}/fetch/toasttab`,
        method: "post",
        values,
        successNotification: () => {
          return {
            message: `Successfully fetched.`,
            type: "success",
          };
        },
        errorNotification: () => {
          return {
            message: `Something errors on fetching.`,
            type: "error",
          };
        },
      }),
    []
  );

  return (
    <Form
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      size="large"
      initialValues={{
        restaurantName: "Jack's Ranche",
        restaurantGuid: "47569b09-1bec-4907-8b03-bc30150e3b2e",
      }}
    >
      <Form.Item<FieldType>
        label="Restaurant Name"
        name="restaurantName"
        required
        rules={[{ required: true, message: "Please input restaurant name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="restaurantGuid"
        name="restaurantGuid"
        required
        rules={[{ required: true, message: "Please input restaurantGuid!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="toastToken"
        name="toastToken"
        required
        rules={[{ required: true, message: "Please input toastToken!" }]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Fetch
        </Button>
      </Form.Item>
    </Form>
  );
};
