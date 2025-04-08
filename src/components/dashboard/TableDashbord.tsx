
import React from 'react';
import { Table } from "@/components/ui/table";

const TableDashbord: React.FC = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Add your table data here */}
        </tbody>
      </Table>
    </div>
  );
};

export default TableDashbord;
