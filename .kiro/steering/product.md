# KWIM ERP - Multi-Tenant Business Management Platform

KWIM is a modular, multi-tenant ERP (Enterprise Resource Planning) platform built with React and TypeScript. The system follows an Odoo-inspired architecture where business domains are organized as independent, self-contained modules.

## Core Modules

The platform includes specialized modules for different business domains:

- **Admin** - Central administration and dashboard
- **Transport** - Fleet and logistics management
- **HR** - Human resources and employee management
- **Finance** - Financial management and accounting
- **CRM** - Customer relationship management
- **Product** - Product catalog and management
- **Sales** - Sales operations and orders
- **Procurement** - Purchase orders and supplier management
- **Manufacturing** - Production planning and execution
- **Inventory** - Stock and warehouse management
- **Maintenance** - Asset maintenance tracking
- **Carwash** - Car wash service management

## Key Features

- **Multi-tenant architecture** - Isolated data per tenant with automatic tenant context management
- **Modular design** - Each business domain is an independent application
- **Role-based access control (RBAC)** - Permission-based UI and actions
- **Shared component library** - Consistent UI across all modules
- **Generic CRUD system** - Reduces boilerplate by 70% for standard list/form operations
- **Type-safe API integration** - Automatic API client generation from OpenAPI specs
- **Internationalization** - Multi-language support (English, French)
