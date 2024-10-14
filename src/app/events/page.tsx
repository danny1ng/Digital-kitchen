"use client";

import { Event, Restaurant } from "@prisma/client";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function EventsList() {
  const { tableProps } = useTable<Event & { restaurants: Restaurant[] }>({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="description"
          title={"Description"}
          render={(value: string) => {
            return value.slice(0, 70) + (value.length > 70 ? "..." : "");
          }}
        />
        <Table.Column
          dataIndex={"restaurants"}
          title={"Restaurants"}
          render={(value: Restaurant[]) => {
            return value?.map((item) => item.name).join(", ");
          }}
        />
        <Table.Column
          dataIndex={["createdAt"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
