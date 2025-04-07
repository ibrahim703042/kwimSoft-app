import EnhancedTable from "./EnhancedTable";
import OrderTable from "./OrderTable";

export default function Role() {

    const orders = [
        { code: "PG234RUJM", priority: "Premium delivery", amount: 5, destination: "Siemoa, DIY", status: "Shipped" },
        { code: "F5234ERTM", priority: "Free Shipping", amount: 1, destination: "Kloten, Joburg", status: "Delivered" },
        { code: "PG299RUSX", priority: "Premium delivery", amount: 5, destination: "Bonrui, DIY", status: "Paid" },
    ];

    return (
        <div>
            <div className="bg-white py-2 px-3 h-full border rounded-md">
                <div>
                    <div className="bg-slate-100 p-1 rounded px-2 py-1">
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">User session</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    <OrderTable orders={orders} />
                </div>
            </div>
        </div>
    )
}
