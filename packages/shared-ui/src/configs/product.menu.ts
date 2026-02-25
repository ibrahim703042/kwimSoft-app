import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Award,
  Box,
  SlidersHorizontal,
  Tag,
  PackagePlus,
  BadgeDollarSign,
  Star,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const productMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "categories", label: "Catégories", icon: FolderTree },
  { key: "sub-categories", label: "Sous-catégories", icon: Layers },
  { key: "brands", label: "Marques", icon: Award },
  { key: "products", label: "Produits", icon: Box },
  { key: "attributes", label: "Attributs", icon: SlidersHorizontal },
  { key: "tags", label: "Étiquettes", icon: Tag },
  { key: "bundles", label: "Lots", icon: PackagePlus },
  { key: "pricing", label: "Tarification", icon: BadgeDollarSign },
  { key: "reviews", label: "Avis", icon: Star },
];

export const productModuleInfo = {
  name: "product",
  displayName: "Produits",
  title: "Produits",
  breadcrumbPath: "/products",
};
