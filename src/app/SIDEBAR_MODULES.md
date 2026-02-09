# Sidebar links and module routes (localhost:3000)

All sidebar items come from registered modules in `registerModules.ts`. Each link path works at `http://localhost:3000` (e.g. `http://localhost:3000/drivers`).

| Sidebar label      | Path(s) | Module        | Route source                    |
|--------------------|--------|---------------|---------------------------------|
| Dashboard          | `/`    | dashboard     | `modules/dashboard`             |
| Drivers            | `/drivers` | transports/driver | `modules/transports/driver`  |
| Vehicles           | `/fleet/vehicle` | transport/vehicle | createGroupedModule     |
| Stations           | `/stations` | transports/station | `modules/transports/station` |
| Schedules          | `/schedules` | transports/schedule | `modules/transports/schedule` |
| Trips              | `/operations/trip` | transport/trip | createGroupedModule     |
| Seats              | `/seating/seat` | transport/seat | createGroupedModule     |
| Tickets            | `/ticketing/ticket` | transport/ticket | createGroupedModule   |
| Reservations       | `/reservations` | transports/reservation | `modules/transports/reservation` |
| Carwash            | `/carwash/*` (children) | carwash | createGroupedModule   |
| Maintenance        | `/maintenance/*` (children) | maintenance | createGroupedModule |
| Reports            | `/reports/*` (children) | report | createGroupedModule   |
| Products           | `/products/*` (children) | product | createGroupedModule   |
| HR                 | `/hr/*` (children) | hr | createGroupedModule             |
| Inventory          | `/inventory/*` (children) | inventory | createGroupedModule   |
| CRM                | `/crm/*` (children) | crm | createGroupedModule             |
| Finance            | `/finance/*` (children) | finance | createGroupedModule   |
| Procurement        | `/procurement/*` (children) | procurement | createGroupedModule |
| Sales              | `/sales/*` (children) | sales | createGroupedModule             |
| User Management    | `/user-management` | user | `modules/user`                  |
| Administration     | `/administration`, `/administration/map-detail`, `/administration/detaillDrive/:id` | administration | `modules/administration` |

**Profile & Settings** (not in sidebar, from Navbar/Footer):

- `/profile` – account profile  
- `/settings` – app settings  

**Auth (no sidebar):**

- `/login`, `/forgot-password`, `/update-password`

**Placeholder page:** For new links that don’t have a page yet, use `ModulePlaceholderPage` and register a route in the module so the sidebar link goes to a “coming soon” page instead of 404.
