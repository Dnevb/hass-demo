import { Menu } from "@headlessui/react";
import React, { FC, useContext, useRef, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../providers/auth";
import { Link, useHistory } from "react-router-dom";
import CartList from "./CartList";
import useSWR, { mutate } from "swr";
import { fetcher } from "..";
import { useToasts } from "react-toast-notifications";

const Layout: FC = ({ children }) => {
  const { addToast } = useToasts();
  const history = useHistory();
  const [cartState, setCartState] = useState(false);
  const auth = useContext(AuthContext);

  const { data, revalidate } = useSWR<{ data: any[] }>(
    "http://localhost:4000/api/carrito"
  );
  const productos = data ? (data.data ? data.data : null) : null;

  return (
    <div>
      <div className="flex flex-col h-screen overflow-y-scroll relative ">
        <div className="h-16 shadow-lg z-10">
          <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
            <Link to="/">
              <img
                src="http://hass-colombia.com/wp-content/uploads/2017/11/hass_logo.png"
                alt="hass logo"
                className="h-12"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <button
                className="focus:outline-none relative p-2"
                onClick={() => setCartState(true)}
              >
                <FiShoppingCart className="h-6 w-6" />
                <span className="top-0 right-0 absolute bg-black text-white h-5 text-xs w-5 rounded-full flex justify-center  items-center border-2 border-white">
                  {productos ? productos.length : 0}
                </span>
              </button>
              {auth?.loggedIn ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="focus:outline-none">
                    <div className="flex items-center">
                      {auth.user.nombres + " " + auth.user.apellidos}
                      <div className="flex ml-3 items-center justify-center bg-gray-100 rounded-full h-9 w-9">
                        <IoMdPerson className="h-5 w-5" />
                      </div>
                    </div>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 bg-white shadow-md border-gray-600 py-4 w-56 rounded-md">
                    <Menu.Item
                      as="button"
                      className="hover:bg-gray-100 w-full py-3 font-sans font-bold"
                      onClick={() => history.push("/historial")}
                    >
                      Historial de compras
                    </Menu.Item>
                    <Menu.Item
                      as="button"
                      className="hover:bg-gray-100 w-full py-3 font-sans font-bold"
                      onClick={() => auth.logout()}
                    >
                      Cerrar sesion
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="rounded-md font-sans font-bold p-2"
                  >
                    Iniciar Sesion
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md font-sans font-bold py-2 px-3 bg-black text-white"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* children */}
        <div className="flex-1">{children}</div>
        {/* carrito */}
        <div
          className={`${
            cartState ? "" : "hidden"
          } flex fixed z-20 h-full w-full`}
        >
          <div
            className="w-3/4 bg-black opacity-20"
            onClick={() => setCartState(false)}
          ></div>
          <div className={`bg-white w-1/4 shadow-lg flex flex-col`}>
            <div className="h-20 flex items-center justify-between mx-7 border-b border-black">
              <h1 className="text-3xl font-sans font-bold ">Carrito</h1>
              <MdClose
                className="h-7 w-7 cursor-pointer"
                onClick={() => setCartState(false)}
              />
            </div>
            <div className="px-7 flex-1">
              {productos ? (
                <CartList productos={productos} />
              ) : (
                "Sin productos"
              )}
            </div>
            <div className="py-4 flex flex-col items-center">
              <div className="flex justify-between items-center py-3 w-5/6">
                <p className="text-xl font-sans font-bold">Total:</p>
                <p className="text-xl font-sans font-bold">
                  $
                  {productos
                    ? productos
                        .map((p) => p.precio)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)
                    : 0}
                </p>
              </div>
              <button
                className="bg-black text-white py-3 px-5 font-bold font-sans text-xl"
                onClick={() => {
                  if (auth?.user)
                    fetcher(
                      "http://localhost:4000/api/carrito/completar",
                      {
                        method: "POST",
                      }
                    ).then(() => {
                      revalidate();
                      mutate("http://localhost:4000/api/productos").then(
                        () => addToast("Compra realizada con exito.")
                      );
                    });
                  else history.push("/login");
                }}
              >
                Completar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
