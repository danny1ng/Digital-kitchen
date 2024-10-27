"use client";

import { Typography, Tabs, Card } from "antd";

import { useState } from "react";
import { ImportForm } from "./_components/import-form";
import { UpdateMenuForm } from "./_components/update-menu";

const items = [
  {
    key: "import",
    label: "Import menu",
  },
  {
    key: "update",
    label: "Update menu",
  },
];

export default function ImportMenuPlugin() {
  const [activeTabKey, setActiveTabKey] = useState<"import" | "update">(
    "import"
  );

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 6 }}>
        Import menu plugin
      </Typography.Title>
      <Card
        tabList={items}
        activeTabKey={activeTabKey}
        onTabChange={(key) => setActiveTabKey(key as any)}
      >
        {activeTabKey === "import" && <ImportForm />}
        {activeTabKey === "update" && <UpdateMenuForm />}
      </Card>
    </div>
  );
}
