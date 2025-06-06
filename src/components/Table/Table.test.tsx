import { render, screen } from "@testing-library/react";
import { Table, TableColumn } from ".";
import "@testing-library/jest-dom";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
};

const columns: TableColumn<Product>[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
];

describe("Table Component", () => {
  it("shows loading state", () => {
    render(<Table data={[]} columns={columns} total={0} loading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<Table data={[]} columns={columns} total={0} loading={false} />);
    expect(screen.getByText("No data found.")).toBeInTheDocument();
  });
});
