"use client";

import { Typography, Tabs } from "antd";

import type { TabsProps } from "antd";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Import menu",
    children: <>sadas</>,
  },
  {
    key: "2",
    label: "Update menu",
    children: <>'Content of Tab Pane 2'</>,
  },
];

export default function ImportMenuPlugin() {
  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 6 }}>
        Import menu plugin
      </Typography.Title>
      <Tabs defaultActiveKey="1" items={items} />;
    </div>
  );
}
