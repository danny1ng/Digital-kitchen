import { Restaurant } from "@prisma/client";
import { useSelect } from "@refinedev/antd";
import { useApiUrl, useCustomMutation } from "@refinedev/core";
import {
  Button,
  Checkbox,
  Col,
  Form,
  FormProps,
  Input,
  Row,
  Select,
} from "antd";
import { useCallback } from "react";

type FieldType = {
  restaurantName: string;
  restaurantGuid: string;
  toastToken: string;
};

export const UpdateMenuForm = () => {
  const [form] = Form.useForm();
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
        errorNotification: (e) => {
          return {
            message: e?.message || `Something errors on fetching.`,
            type: "error",
          };
        },
      }),
    []
  );

  const {
    selectProps: restaurantSelectProps,
    query: { data },
  } = useSelect<Restaurant>({
    resource: "restaurants",
    optionLabel: "name",
    optionValue: "toastGuid",
  });

  const onGenderChange = (value: string) => {
    const token = data?.data.find(
      (item) => item.toastGuid === value
    )?.toastToken;
    form.setFieldsValue({ toastToken: token });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      size="large"
      initialValues={{
        fields: ["name", "description", "image", "calories", "basePrice"],
      }}
    >
      <Form.Item
        label={"Restaurant"}
        name={["restaurantGuid"]}
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
          onChange={(values, options) => {
            restaurantSelectProps?.onChange?.(values, options);
            onGenderChange(values as any);
          }}
        />
      </Form.Item>

      <Form.Item<FieldType>
        label="toastToken"
        name="toastToken"
        required
        rules={[{ required: true, message: "Please input toastToken!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="fields" label="Fields">
        <Checkbox.Group>
          <Row>
            <Col span={8}>
              <Checkbox value="name" style={{ lineHeight: "32px" }}>
                Name
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="description" style={{ lineHeight: "32px" }}>
                Description
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="image" style={{ lineHeight: "32px" }}>
                Image
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="calories" style={{ lineHeight: "32px" }}>
                Calories
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="basePrice" style={{ lineHeight: "32px" }}>
                Price
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Fetch
        </Button>
      </Form.Item>
    </Form>
  );
};
