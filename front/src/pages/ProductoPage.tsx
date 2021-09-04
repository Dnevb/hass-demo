import { useHistory, useLocation } from "react-router";
import { mutate } from "swr";
import { fetcher } from "..";
import { AuthContext } from "../providers/auth";
import { useContext } from "react";
import { useToasts } from "react-toast-notifications";

const ProductoPage = () => {
  const { addToast } = useToasts();
  const { state } = useLocation<any>();
  const history = useHistory();
  const auth = useContext(AuthContext);

  return (
    <div className="flex h-full">
      <div className="w-2/4 flex items-center relative">
        <div className=" absolute left-7 top-7">
          <p className="bg-gray-200 p-5 text-3xl">{state.nombre}</p>
          <p className="bg-gray-200 p-5 w-min text-3xl">
            <span className="text-4xl">$</span>
            {state.precio}
          </p>
        </div>
        <img
          src={state.url_img}
          alt={state.nombre}
          className="p-24 w-full max-w-screen-sm"
        />
      </div>
      <div className="bg-gray-50 w-2/4 flex flex-col">
        <div className="h-4/6 w-5/6 mx-auto pt-24 font-sans text-xl">
          {state.descripcion
            ? state.descripcion
            : "Este articulo no posee descripcion."}
        </div>
        <div className="h-2/6 flex items-center justify-center">
          <div className="text-lg p-4 px-6 font-sans bg-gray-600 text-white">
            En Stock: {state.cantidad}
          </div>
          <button
            className="text-white bg-black p-4 text-lg font-sans inline-block"
            onClick={() => {
              if (auth?.user)
                fetcher("http://localhost:4000/api/carrito/producto", {
                  method: "POST",
                  body: JSON.stringify({
                    id: state.uid,
                    cantidad: 1,
                  }),
                }).then((res) =>
                  mutate("http://localhost:4000/api/carrito").then(() =>
                    addToast("Producto agregado", {
                      appearance: "success",
                    })
                  )
                );
              else addToast("Inicie sesion para continuar");
            }}
          >
            AGREGAR AL CARRO
          </button>
          {auth?.loggedIn ? (
            auth?.user.admin ? (
              <button
                className="text-lg p-4 px-4 font-sans bg-red-600 text-white"
                onClick={() =>
                  fetcher("http://localhost:4000/api/productos", {
                    method: "DELETE",
                    body: JSON.stringify({
                      id: state.uid,
                    }),
                  }).then(() =>
                    mutate("http://localhost:4000/api/productos").then(
                      () => {
                        history.push("/");
                        addToast("Producto eliminado", {
                          appearance: "success",
                        });
                      }
                    )
                  )
                }
              >
                Remover producto
              </button>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoPage;
