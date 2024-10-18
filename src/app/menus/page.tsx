"use client";

import { Event, Menu, Restaurant } from "@prisma/client";
import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function MenuList() {
  const { tableProps } = useTable<Menu & { restaurant: Restaurant }>({
    syncWithLocation: true,
    queryOptions: {
      refetchOnWindowFocus: true,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title={"Name"} />

        <Table.Column
          dataIndex={["restaurant", "name"]}
          title={"Restaurants"}
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
