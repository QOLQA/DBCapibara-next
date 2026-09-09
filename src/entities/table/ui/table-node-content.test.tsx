import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TableNodeContent } from "./table-node-content";
import { DropdownProvider } from "@fsd/shared/lib/dropdown-context";
import type { TableData } from "@fsd/entities/solution";

function renderTable(data: TableData) {
  return render(
    <DropdownProvider>
      <TableNodeContent data={data} id="parent" />
    </DropdownProvider>,
  );
}

function column(id: string, name: string) {
  return { id, name, type: "VARCHAR" };
}

function nested(id: string, label: string): TableData {
  return {
    id,
    label,
    columns: [column(`${id}-c1`, "field")],
  };
}

describe("TableNodeContent nested layout", () => {
  it("keeps a single nested table stacked under few attributes", () => {
    const { container } = renderTable({
      id: "orders",
      label: "Orders",
      columns: [column("a", "order_id"), column("b", "status")],
      nestedTables: [nested("items", "OrderItems")],
    });

    expect(container.querySelector(".table-content--split")).toBeNull();
    expect(container.querySelector(".table-nesteds--grid")).toBeNull();
  });

  it("places a nested table beside many attributes", () => {
    const { container } = renderTable({
      id: "orders",
      label: "Orders",
      columns: [
        column("a", "order_id"),
        column("b", "user_id"),
        column("c", "seller_id"),
        column("d", "status"),
        column("e", "total"),
        column("f", "placed_at"),
      ],
      nestedTables: [nested("items", "OrderItems")],
    });

    expect(container.querySelector(".table-content--split")).not.toBeNull();
    expect(container.querySelector(".table-nesteds--grid")).toBeNull();
  });

  it("grids multiple nested tables beside many attributes", () => {
    const { container } = renderTable({
      id: "orders",
      label: "Orders",
      columns: [
        column("a", "order_id"),
        column("b", "user_id"),
        column("c", "seller_id"),
        column("d", "status"),
        column("e", "total"),
        column("f", "placed_at"),
      ],
      nestedTables: [
        nested("items", "OrderItems"),
        nested("addr", "Addresses"),
        nested("pay", "Payments"),
      ],
    });

    expect(container.querySelector(".table-content--split")).not.toBeNull();
    expect(container.querySelector(".table-nesteds--grid")).not.toBeNull();
    expect(
      container.querySelector(".table-nesteds--cols-3"),
    ).not.toBeNull();
  });
});
