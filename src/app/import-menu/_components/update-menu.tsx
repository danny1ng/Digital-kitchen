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
  const apiUrl = useApiUrl();
  const { mutateAsync, isLoading } = useCustomMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = useCallback(
    (values: FieldType) => console.log(values),
    // mutateAsync({
    //   url: `${apiUrl}/fetch/toasttab`,
    //   method: "post",
    //   values,
    //   successNotification: () => {
    //     return {
    //       message: `Successfully fetched.`,
    //       type: "success",
    //     };
    //   },
    //   errorNotification: () => {
    //     return {
    //       message: `Something errors on fetching.`,
    //       type: "error",
    //     };
    //   },
    // }),
    []
  );

  const { selectProps: restaurantSelectProps } = useSelect({
    resource: "restaurants",
    optionLabel: "name",
  });

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
      <Form.Item
        label={"Restaurant"}
        name={["restaurantId"]}
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
              <Checkbox value="price" style={{ lineHeight: "32px" }}>
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
