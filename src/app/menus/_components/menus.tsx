import { Button, Collapse, Form, Input } from "antd";

import { CloseOutlined } from "@ant-design/icons";
import { MenuItems } from "./menu-items";

export const MenusGroup = () => {
  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
          {fields.length > 0 && (
            <Collapse
              items={fields.map((field) => ({
                key: field.key,
                label: `Group Menu ${field.name + 1}`,
                extra: (
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                ),
                children: (
                  <>
                    <Form.Item label="Name" name={[field.name, "name"]}>
                      <Input />
                    </Form.Item>

                    {/* Nest Form.List */}
                    <MenuItems name={field.name} />
                  </>
                ),
              }))}
            />
          )}

          <Button type="dashed" onClick={() => add()} block>
            + Add Menu Group
          </Button>
        </div>
      )}
    </Form.List>
  );
};
