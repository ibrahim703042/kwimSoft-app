/**
 * Product Management Module
 *
 * Entities:
 * - Categories, Sub Categories, Brands, Products, Attributes,
 *   Tags, Bundles, Pricing, Reviews
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Package } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import ProductShell from "./ProductShell";

export const productModule: FrontModule = {
  name: "product",
  routes: [
    {
      path: "/products",
      element: (
        <>
          <PageTitle title="Products" />
          <ProductShell />
        </>
      ),
      permission: "product.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "product",
      label: "Products",
      path: "/products",
      icon: Package,
      permission: "product.read",
    },
  ] as MenuItem[],
  permissions: [
    "category.read", "category.create", "category.update", "category.delete",
    "sub_category.read", "sub_category.create", "sub_category.update", "sub_category.delete",
    "brand.read", "brand.create", "brand.update", "brand.delete",
    "product.read", "product.create", "product.update", "product.delete",
    "attribute.read", "attribute.create", "attribute.update", "attribute.delete",
    "product_tag.read", "product_tag.create", "product_tag.update", "product_tag.delete",
    "product_bundle.read", "product_bundle.create", "product_bundle.update", "product_bundle.delete",
    "product_price.read", "product_price.create", "product_price.update", "product_price.delete",
    "product_review.read", "product_review.create", "product_review.update", "product_review.delete",
  ],
};
