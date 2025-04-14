import { ComponentType } from "react";

export type RouteItem = {
  path: string;
  name: string;
  description?: string;
  component: ComponentType;
};
