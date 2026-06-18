interface HoraireItem {
  _id?: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: string;
  price?: { amount?: string | number; currency?: { symbol?: string } };
}

interface HoraireComponentProps {
  items: HoraireItem;
}

export default function HoraireComponent({ items }: Readonly<HoraireComponentProps>) {
  return (
    <div className="ml-10 mt-1 rounded-md border bg-muted/30 p-2 text-sm">
      <p className="text-muted-foreground">
        Arrivée : {items?.arrivalTime ?? "—"} · Statut : {items?.status ?? "—"}
      </p>
      {items?.price?.amount != null && (
        <p className="font-medium">
          Prix : {items.price.amount} {items.price.currency?.symbol ?? ""}
        </p>
      )}
    </div>
  );
}
