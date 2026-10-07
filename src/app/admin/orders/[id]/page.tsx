import Link from "next/link";
import { notFound } from "next/navigation";
import StatusActions from "@/components/admin/StatusActions";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrder } from "@/lib/admin-data";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await getOrder(orderId); // checks "admin:view" inside
  if (!order) notFound();
  const user = await getCurrentUser();

  return (
    <section className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-brand hover:underline">
        ← Semua order
      </Link>
      <h1 className="mt-4 text-3xl font-black">Order #{order.id}</h1>
      <p className="mt-1 flex items-center gap-3 text-ink/70">
        {order.date} {order.time}
        <span data-testid="order-status">
          <StatusBadge status={order.status} />
        </span>
      </p>
      {/* A UI hint only: the real check is inside updateOrderStatusAction */}
      {can(user, "orders:update") && <StatusActions orderId={order.id} status={order.status} />}

      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Pizza</th>
            <th className="px-4 py-3">Ukuran</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Harga</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line, i) => (
            <tr key={i} className="border-t border-black/5">
              <td className="px-4 py-2">
                <Link href={`/admin/products/${line.pizzaId}`} className="hover:underline">
                  {line.name}
                </Link>
              </td>
              <td className="px-4 py-2">{line.size}</td>
              <td className="px-4 py-2 text-right">{line.quantity}</td>
              <td className="px-4 py-2 text-right">{formatPrice(line.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-lg font-bold" data-testid="order-total">
        Total {formatPrice(order.total)}
      </p>
    </section>
  );
}
