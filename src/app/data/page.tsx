import { Table, TableColumn } from '@/components/Table';

type User = {
  id: number;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
};

const users: User[] = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' },
  { id: 3, name: 'Charlie', role: 'Viewer' },
  { id: 4, name: 'Diana', role: 'Admin' },
  { id: 5, name: 'Eve', role: 'Viewer' },
  { id: 6, name: 'Frank', role: 'Editor' },
];

const columns: TableColumn<User>[] = [
  { key: 'id', label: 'ID', width: 'w-16' },
  { key: 'name', label: 'Name', width: 'w-[200px]' },
  { key: 'role', label: 'Role', width: 'w-32' },
];


export default function DataPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Data</h1>

      <Table
        data={users}
        columns={columns}
        searchableKey="name"
        filterOptions={{ key: 'role', values: ['Admin', 'Editor', 'Viewer'] }}
        pageSize={3}
      />
    </div>
  )
}
