import { Link } from "react-router-dom";
import useSWR from "swr";
import { GrAddCircle } from "react-icons/gr";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/auth";

const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data } = useSWR<{ data: any[] }>(
    "http://localhost:4000/api/productos"
  );
  const auth = useContext(AuthContext);

  return (
    <div className="container mx-auto max-w-5xl pt-6">
      {auth?.user?.admin ? (
        <div className="flex justify-end">
          <Link
            to="/producto/create"
            className="py-3 px-5 font-sans font-bold flex items-center"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <GrAddCircle className="mx-1 h-5 w-5" />
            Agregar producto
          </Link>
        </div>
      ) : (
        ""
      )}

      <div className="grid grid-cols-4 gap-6">
        {data?.data ? (
          data?.data.map((producto, i) => (
            <div className="pb-5" key={i}>
              <Link
                to={{
                  pathname: `/${producto.uid}`,
                  state: producto,
                }}
              >
                <div className="w-full py-5 px-3 relative">
                  <img src={producto.url_img} alt={producto.nombre} />
                  {/* <MdAddShoppingCart className="absolute right-8 bottom-8 h-6 w-6" /> */}
                </div>
                <p className="font-sans font-semibold text-xl hover:text-yellow-500">
                  {producto.nombre}
                </p>
                <p className="text-xl font-normal">${producto.precio}</p>
              </Link>
            </div>
          ))
        ) : (
          <h1>Sin productos</h1>
        )}
      </div>
    </div>
  );
};

export default HomePage;
