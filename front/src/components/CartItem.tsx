import React, { FC, useState } from "react";
import { MdAdd } from "react-icons/md";
import { FcMinus } from "react-icons/fc";
import { BsTrash } from "react-icons/bs";
import { fetcher } from "..";
import { mutate } from "swr";
import { useToasts } from "react-toast-notifications";

interface CartItemProps {
  url_img: string;
  nombre: string;
  cantidad: number;
  precio: number;
  uid: string;
}

const CartItem: FC<CartItemProps> = ({
  cantidad,
  nombre,
  url_img,
  precio,
  uid,
}) => {
  const { addToast } = useToasts();
  const [cant, setCantidad] = useState(cantidad);

  function setCant(val: number) {
    fetch("http://localhost:4000/api/carrito/producto", {
      method: "PATCH",
      body: JSON.stringify({
        id: uid,
        cantidad: val,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("jid")
          ? {
              authorization: localStorage.getItem("jid")!,
            }
          : {}),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.errors && res.data[0].uid) {
          mutate("http://localhost:4000/api/carrito");
          setCantidad(res.data[0].cantidad);
        }
      });
  }

  return (
    <div className="flex my-3 items-center">
      <div className="h-16 w-16 border-2 border-black">
        <img src={url_img} alt={nombre} className="h-full w-full" />
      </div>
      <div className="flex-1 flex flex-col px-2 truncate">
        <h3 className="text-lg font-sans font-bold">{nombre}</h3>
        <div className="flex items-center justify-start">
          <FcMinus
            className="cursor-pointer"
            onClick={() => setCant(cant - 1)}
          />
          <span className="px-2">{cant}</span>
          <MdAdd
            className="cursor-pointer"
            onClick={() => setCant(cant + 1)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-lg font-sans font-bold">${precio.toFixed(2)}</p>
        <button
          onClick={() =>
            fetcher("http://localhost:4000/api/carrito/producto", {
              method: "DELETE",
              body: JSON.stringify({
                id: uid,
              }),
            }).then((res) =>
              mutate("http://localhost:4000/api/carrito").then(() =>
                addToast("Producto removido exitosamente", {
                  appearance: "success",
                })
              )
            )
          }
        >
          <BsTrash className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
