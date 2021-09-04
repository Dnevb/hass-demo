import useSWR from "swr";

const HistorialPage = () => {
  const { data } = useSWR<{ data: any[] }>(
    "http://localhost:4000/api/carrito/historial"
  );

  return (
    <div className="container mx-auto max-w-2xl pt-6">
      <h1 className="text-3xl font-bold font-sans mb-4">
        Historial de compras
      </h1>
      {data?.data.length
        ? data?.data.map(({ uid, updated_at, count }) => (
            <div className="py-3 px-5 border-b border-gray-400">
              <h1 className="text-xl font-semibold">Id de orden: {uid}</h1>
              <h2 className="text-lg">
                Fecha: {new Date(updated_at).toDateString()}
              </h2>
              <h2 className="text-lg">Cantidad de productos: {count}</h2>
            </div>
          ))
        : "Usted no ha realizado ninguna compra."}
    </div>
  );
};

export default HistorialPage;
