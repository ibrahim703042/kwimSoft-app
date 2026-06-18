File Tree: kwim-app
Generated on: 6/18/2026, 1:55:05 PM
Root path: d:\app\kwim-app

────────────────────────────────────────────────────────────────────────────────

├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── font/
│   │   │   ├── Roboto-Black.ttf
│   │   │   ├── Roboto-Bold.ttf
│   │   │   ├── Roboto-Medium.ttf
│   │   │   └── Roboto-Regular.ttf
│   │   ├── img/
│   │   │   ├── lang/
│   │   │   │   ├── english.png
│   │   │   │   └── france.png
│   │   │   ├── logo/
│   │   │   │   ├── kwimsoft-dark.png
│   │   │   │   └── kwimsoft-light.png
│   │   │   ├── users/
│   │   │   │   └── avatar.png
│   │   │   └── utils/
│   │   │       ├── agenda.png
│   │   │       ├── employees.png
│   │   │       ├── inventory.png
│   │   │       ├── orders.png
│   │   │       ├── pattern.png
│   │   │       ├── revenue.png
│   │   │       └── usersIcon.png
│   │   └── react.svg
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── inventory-table.tsx
│   │   │   └── recent-activity.tsx
│   │   ├── data-table/
│   │   │   └── CardDataTable.tsx
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx
│   │   ├── map/
│   │   │   ├── table/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── inventoryTable.tsx
│   │   │   │   └── inventoryToolbar.tsx
│   │   │   ├── MapStyles.tsx
│   │   │   └── ReusableDataTable.tsx
│   │   ├── sidebar/
│   │   │   ├── SidebarFooter.tsx
│   │   │   ├── SidebarHeader.tsx
│   │   │   ├── SidebarMenu.tsx
│   │   │   ├── SidebarMenuItem.tsx
│   │   │   ├── SidebarSearch.tsx
│   │   │   └── index.tsx
│   │   ├── topbar/
│   │   │   ├── GlobalSearch.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── UserInfo.tsx
│   │   │   ├── index.tsx
│   │   │   ├── notificationDropdown .tsx
│   │   │   └── userDropdown.tsx
│   │   ├── ui/
│   │   │   ├── alert-dialog.jsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.jsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.jsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── toast.jsx
│   │   │   ├── toaster.jsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   ├── utilities/
│   │   │   ├── ErrorBanner.tsx
│   │   │   └── PageTitle.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── HeaderBox.tsx
│   │   ├── NotFound.tsx
│   │   ├── PremiumFeature.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── StatCard.tsx
│   ├── constants/
│   │   └── index.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.jsx
│   │   ├── use-toast.ts
│   │   ├── useFetch.jsx
│   │   ├── usePost.jsx
│   │   ├── useSettings.ts
│   │   └── useUserData.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   └── db.json
│   │   ├── api-hooks.ts
│   │   ├── api.ts
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   ├── locales/
│   │   ├── en.json
│   │   └── fr.json
│   ├── pages/
│   │   ├── administration/
│   │   │   └── Administration.tsx
│   │   ├── customer/
│   │   │   └── index.tsx
│   │   ├── dashbord/
│   │   │   └── DashboardPage.tsx
│   │   ├── driver/
│   │   │   ├── AddDriver.tsx
│   │   │   ├── Driver.tsx
│   │   │   ├── EditDriver.tsx
│   │   │   └── ViewDriver.tsx
│   │   ├── gare/
│   │   │   ├── AddGare.tsx
│   │   │   ├── EditStation.tsx
│   │   │   ├── Gare.tsx
│   │   │   ├── GareMap.tsx
│   │   │   └── ViewGare.tsx
│   │   ├── horaires/
│   │   │   ├── AddHoraire.tsx
│   │   │   └── Horaire.tsx
│   │   ├── inventory/
│   │   │   └── Inventory.tsx
│   │   ├── login/
│   │   │   ├── Effacer.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── UpdatePassword.tsx
│   │   │   └── login.css
│   │   ├── organization/
│   │   │   └── organization.tsx
│   │   ├── payroll/
│   │   │   └── Payroll.tsx
│   │   ├── settings/
│   │   │   ├── accountSettings.tsx
│   │   │   ├── appearanceSettings.tsx
│   │   │   ├── index.tsx
│   │   │   ├── notificationsSettings.tsx
│   │   │   └── securitySettings.tsx
│   │   └── user-management/
│   │       ├── EnhancedTable.tsx
│   │       ├── Groupe.tsx
│   │       ├── OrderTable.tsx
│   │       ├── Role.tsx
│   │       ├── User.tsx
│   │       ├── UserManagement.tsx
│   │       ├── UserSession.tsx
│   │       └── role.css
│   ├── routes/
│   │   ├── customer/
│   │   │   └── customerRoutes.tsx
│   │   ├── dashbord/
│   │   │   └── dashbordRoutes.tsx
│   │   ├── horaire/
│   │   │   └── horaireRoutes.tsx
│   │   ├── inventory/
│   │   │   └── inventoryRoute.tsx
│   │   ├── organization/
│   │   │   └── oraganizationRoute.tsx
│   │   ├── settings/
│   │   │   ├── changePasswordRoute.tsx
│   │   │   └── settingsRoutes.tsx
│   │   ├── user/
│   │   │   ├── administratorRoute.tsx
│   │   │   └── userRoutes.tsx
│   │   ├── RoutesProvider.tsx
│   │   └── routeItem.tsx
│   ├── store/
│   │   ├── actions/
│   │   │   ├── appActions.tsx
│   │   │   └── userActions.tsx
│   │   ├── reducers/
│   │   │   ├── appReducer.tsx
│   │   │   └── userReducer.tsx
│   │   ├── selectors/
│   │   │   ├── appSelectors.tsx
│   │   │   ├── themeStore.ts
│   │   │   ├── useLanguageStore.ts
│   │   │   ├── useSidebarStore.tsx
│   │   │   └── userSelector.tsx
│   │   ├── index.tsx
│   │   └── useUserStore.tsx
│   ├── styles/
│   │   ├── materiel.css
│   │   └── shadcn.css
│   ├── types/
│   │   └── index.d.ts
│   ├── App.css
│   ├── App.tsx
│   ├── axiosInstance.tsx
│   ├── declarations.d.ts
│   ├── i18n.ts
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── README.md
├── components.json
├── config.tsx
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.js

────────────────────────────────────────────────────────────────────────────────
Generated by FileTree Pro Extension