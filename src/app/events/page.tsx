"use client";

import { Event, Restaurant } from "@prisma/client";
import {
  DateField,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function EventsList() {
  const { tableProps } = useTable<Event & { restaurants: Restaurant[] }>({
    syncWithLocation: true,
    queryOptions: {
      refetchOnWindowFocus: true,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex={["banner"]}
          title={"Created at"}
          render={(value: any) => (
            <ImageField
              preview={false}
              value={value}
              style={{ width: 32, height: 32, borderRadius: "100%" }}
            />
          )}
        />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="description"
          title={"Description"}
          render={(value: string) => {
            return value.slice(0, 70) + (value.length > 70 ? "..." : "");
          }}
        />
        <Table.Column
          dataIndex={["restaurant", "name"]}
          title={"Restaurants"}
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
