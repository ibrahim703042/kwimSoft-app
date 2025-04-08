import React, { useState, useMemo } from 'react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/useUserStore';

export default function OrganizationPage() {
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: '',
    search: ''
  });
  const { plan } = useUserStore();
  const isPremium = plan === 'premium';

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          value={filters.department}
          onValueChange={(value) => handleFilterChange('department', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
        {isPremium && (
          <Select
            value={filters.role}
            onValueChange={(value) => handleFilterChange('role', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Rest of your organization page content */}
    </div>
  );
}
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useTenants, useCreateTenant } from '@/lib/api-hooks';
// import { PlusCircle, Building, Check, X } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// const tenantFormSchema = z.object({
//   id: z.string().min(3, 'ID must be at least 3 characters'),
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   plan: z.string().min(1, 'Please select a plan'),
//   active: z.boolean().default(true),
// });

// type TenantFormValues = z.infer<typeof tenantFormSchema>;

// const OrganizationPage: React.FC = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [addTenantOpen, setAddTenantOpen] = useState(false);

//   const { toast } = useToast();
//   const { data: tenantsData, isLoading } = useTenants(page, limit);
//   const { mutate: createTenant, isPending } = useCreateTenant();

//   const form = useForm<TenantFormValues>({
//     resolver: zodResolver(tenantFormSchema),
//     defaultValues: {
//       id: '',
//       name: '',
//       plan: 'basic',
//       active: true,
//     },
//   });

//   const onSubmit = (data: TenantFormValues) => {
//     createTenant(data, {
//       onSuccess: () => {
//         toast({
//           title: "Organization Created",
//           description: "The organization has been created successfully",
//         });
//         setAddTenantOpen(false);
//         form.reset();
//       },
//       onError: (error) => {
//         toast({
//           title: "Error",
//           description: `Failed to create organization: ${error.message}`,
//           variant: "destructive",
//         });
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-medium text-gray-800">Organization Management</h1>
//         <p className="text-gray-600">Manage your SaaS organizations and tenants</p>
//       </div>

//       <Card className="shadow-md">
//         <CardHeader className="border-b border-gray-200 p-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <CardTitle>Organizations</CardTitle>
//             <Dialog open={addTenantOpen} onOpenChange={setAddTenantOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <PlusCircle className="h-4 w-4 mr-2" />
//                   Add Organization
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                   <DialogTitle>Add New Organization</DialogTitle>
//                 </DialogHeader>
//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
//                     <FormField
//                       control={form.control}
//                       name="id"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Organization ID</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Enter organization ID" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Organization Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Enter organization name" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="plan"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Subscription Plan</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select a plan" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="basic">Basic</SelectItem>
//                               <SelectItem value="premium">Premium</SelectItem>
//                               <SelectItem value="enterprise">Enterprise</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <DialogFooter>
//                       <Button variant="outline" type="button" onClick={() => setAddTenantOpen(false)}>
//                         Cancel
//                       </Button>
//                       <Button type="submit" disabled={isPending}>
//                         {isPending ? 'Creating...' : 'Create Organization'}
//                       </Button>
//                     </DialogFooter>
//                   </form>
//                 </Form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Organization</TableHead>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Plan</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8 text-gray-500">
//                       Loading organizations...
//                     </TableCell>
//                   </TableRow>
//                 ) : !tenantsData?.tenants || tenantsData.tenants.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8 text-gray-500">
//                       No organizations found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   tenantsData.tenants.map((tenant) => (
//                     <TableRow key={tenant.id}>
//                       <TableCell>
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
//                             <Building className="h-5 w-5 text-gray-500" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="font-medium">{tenant.name}</div>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{tenant.id}</code>
//                       </TableCell>
//                       <TableCell>
//                         {tenant.plan === 'basic' && <Badge className="bg-blue-100 text-blue-800">Basic</Badge>}
//                         {tenant.plan === 'premium' && <Badge className="bg-purple-100 text-purple-800">Premium</Badge>}
//                         {tenant.plan === 'enterprise' && <Badge className="bg-green-100 text-green-800">Enterprise</Badge>}
//                       </TableCell>
//                       <TableCell>
//                         {tenant.active ? (
//                           <Badge className="bg-green-100 text-green-800">
//                             <Check className="h-3 w-3 mr-1" />
//                             Active
//                           </Badge>
//                         ) : (
//                           <Badge variant="destructive">
//                             <X className="h-3 w-3 mr-1" />
//                             Inactive
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{new Date(tenant.created_at).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center space-x-2">
//                           <Button variant="outline" size="sm">View</Button>
//                           <Button variant="outline" size="sm">Edit</Button>
//                           {tenant.active ? (
//                             <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
//                               Deactivate
//                             </Button>
//                           ) : (
//                             <Button variant="outline" size="sm" className="text-green-500 hover:text-green-700">
//                               Activate
//                             </Button>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
          
//           {tenantsData && (
//             <div className="p-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing {(page - 1) * limit + 1} to {Math.min(page * limit, tenantsData.total)} of {tenantsData.total} organizations
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(p => p + 1)}
//                   disabled={page * limit >= tenantsData.total}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OrganizationPage;
