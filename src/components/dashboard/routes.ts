import { HomeIcon, SettingsIcon, ShoppingBagIcon, ShoppingCartIcon, TagIcon, UserIcon } from "lucide-react";

export const sidebarRoutes = [
	{
		label: "Admin",
		menu: [
			{ title: "Home", url: "/dashboard", icon: HomeIcon },
			{ title: "Orders", url: "/dashboard/orders", icon: ShoppingCartIcon },
		],
	},
	{
		label: "Store",
		menu: [
			{ title: "Products", url: "/dashboard/products", icon: ShoppingBagIcon },
			{ title: "Categories", url: "/dashboard/categories", icon: TagIcon },
		],
	},
	{
		label: "Account",
		menu: [
			{ title: "Profile", url: "/account", icon: UserIcon },
			{ title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
		],
	},
];

export const dashboardRoutes = [
	{
		route: "/dashboard",
		routeTitle: "Dashboard",
		routeList: [],
	},
	{
		route: "/dashboard/orders",
		routeTitle: "Orders",
		routeList: [{ name: "Dashboard", url: "/dashboard" }],
	},
	{
		route: "/dashboard/orders/orderId",
		routeTitle: "Order Details",
		routeList: [
			{ name: "Dashboard", url: "/dashboard" },
			{ name: "Orders", url: "/dashboard/orders" },
		],
	},
	{
		route: "/dashboard/products",
		routeTitle: "Products",
		routeList: [{ name: "Dashboard", url: "/dashboard" }],
	},
	{
		route: "/dashboard/products/new",
		routeTitle: "New Product",
		routeList: [
			{ name: "Dashboard", url: "/dashboard" },
			{ name: "Products", url: "/dashboard/products" },
		],
	},
	{
		route: "/dashboard/products/productId",
		routeTitle: "Edit Product",
		routeList: [
			{ name: "Dashboard", url: "/dashboard" },
			{ name: "Products", url: "/dashboard/products" },
		],
	},
	{
		route: "/dashboard/categories",
		routeTitle: "Categories",
		routeList: [{ name: "Dashboard", url: "/dashboard" }],
	},
	{
		route: "/dashboard/categories/new",
		routeTitle: "New Category",
		routeList: [
			{ name: "Dashboard", url: "/dashboard" },
			{ name: "Categories", url: "/dashboard/categories" },
		],
	},
	{
		route: "/dashboard/categories/categoryId",
		routeTitle: "Edit Category",
		routeList: [
			{ name: "Dashboard", url: "/dashboard" },
			{ name: "Categories", url: "/dashboard/categories" },
		],
	},
	{
		route: "/dashboard/settings",
		routeTitle: "Settings",
		routeList: [{ name: "Dashboard", url: "/dashboard" }],
	},
] satisfies {
	route: string;
	routeTitle: string;
	routeList: Array<{ name: string; url: string }>;
}[];
