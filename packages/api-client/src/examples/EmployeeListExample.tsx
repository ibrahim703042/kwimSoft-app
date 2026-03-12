/**
 * Example: Using Generated API Hooks with React Query
 * 
 * This file demonstrates how to use the auto-generated Orval hooks
 * in your React components. After running `pnpm api:generate`, you'll
 * have type-safe hooks for all your API endpoints.
 * 
 * Prerequisites:
 * 1. Backend services must be running with Swagger enabled
 * 2. Run `pnpm api:generate` to generate the API client
 * 3. Wrap your app with QueryClientProvider
 */

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// After generation, import hooks like this:
// import {
//   useGetEmployees,
//   useGetEmployeeById,
//   useCreateEmployee,
//   useUpdateEmployee,
//   useDeleteEmployee,
//   getGetEmployeesQueryKey,
// } from '@kwim/api-client/generated/hr';
// 
// import type {
//   CreateEmployeeDto,
//   UpdateEmployeeDto,
//   Employee,
// } from '@kwim/api-client/generated/hr';

// Placeholder types until generation
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
}

interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  positionId: string;
}

/**
 * Example 1: Basic List with Pagination
 */
export function EmployeeListExample() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // After generation, use the hook like this:
  // const { data, isLoading, error, refetch } = useGetEmployees({
  //   page,
  //   limit: 10,
  //   search,
  // });

  // Placeholder for demonstration
  const isLoading = false;
  const error = null;
  const data = { data: [] as Employee[], total: 0 };

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  if (error) {
    return <div>Error loading employees: {(error as Error).message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Employee Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Department</th>
            <th className="border p-2 text-left">Position</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {employee.firstName} {employee.lastName}
              </td>
              <td className="border p-2">{employee.email}</td>
              <td className="border p-2">{employee.department}</td>
              <td className="border p-2">{employee.position}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * Example 2: Create Employee Form with Mutation
 */
export function CreateEmployeeExample() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    positionId: '',
  });

  // After generation, use the mutation hook like this:
  // const createMutation = useCreateEmployee({
  //   mutation: {
  //     onSuccess: () => {
  //       // Invalidate and refetch employees list
  //       queryClient.invalidateQueries({ queryKey: getGetEmployeesQueryKey() });
  //       // Reset form
  //       setFormData({
  //         firstName: '',
  //         lastName: '',
  //         email: '',
  //         departmentId: '',
  //         positionId: '',
  //       });
  //     },
  //     onError: (error) => {
  //       console.error('Failed to create employee:', error);
  //     },
  //   },
  // });

  // Placeholder for demonstration
  const createMutation = {
    mutate: (data: CreateEmployeeDto) => console.log('Creating:', data),
    isPending: false,
    isError: false,
    error: null as Error | null,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">Create Employee</h2>

      <div className="mb-4">
        <label className="block mb-1">First Name</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {createMutation.isError && (
        <div className="text-red-500 mb-4">
          Error: {createMutation.error?.message}
        </div>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {createMutation.isPending ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
}

/**
 * Example 3: Employee Detail with Update and Delete
 */
export function EmployeeDetailExample({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();

  // After generation, use hooks like this:
  // const { data: employee, isLoading } = useGetEmployeeById(employeeId);
  // 
  // const updateMutation = useUpdateEmployee({
  //   mutation: {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: getGetEmployeesQueryKey() });
  //     },
  //   },
  // });
  // 
  // const deleteMutation = useDeleteEmployee({
  //   mutation: {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: getGetEmployeesQueryKey() });
  //       // Navigate back to list
  //     },
  //   },
  // });

  // Placeholder for demonstration
  const employee: Employee | null = null;
  const isLoading = false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {employee.firstName} {employee.lastName}
      </h1>
      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
      <p>Position: {employee.position}</p>

      <div className="flex gap-2 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}

/**
 * Example 4: Optimistic Updates
 */
export function OptimisticUpdateExample({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();

  // After generation, implement optimistic updates like this:
  // const updateMutation = useUpdateEmployee({
  //   mutation: {
  //     onMutate: async (newData) => {
  //       // Cancel outgoing refetches
  //       await queryClient.cancelQueries({ queryKey: ['employee', employeeId] });
  //       
  //       // Snapshot previous value
  //       const previousEmployee = queryClient.getQueryData(['employee', employeeId]);
  //       
  //       // Optimistically update
  //       queryClient.setQueryData(['employee', employeeId], (old: Employee) => ({
  //         ...old,
  //         ...newData,
  //       }));
  //       
  //       return { previousEmployee };
  //     },
  //     onError: (err, newData, context) => {
  //       // Rollback on error
  //       queryClient.setQueryData(['employee', employeeId], context?.previousEmployee);
  //     },
  //     onSettled: () => {
  //       // Refetch after mutation
  //       queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
  //     },
  //   },
  // });

  return <div>Optimistic update example - see code comments</div>;
}

export default EmployeeListExample;
