import React, { FC } from "react";
import useSWR from "swr";
import CartItem from "./CartItem";

interface CartListProps {
  productos: any[];
}

const CartList: FC<CartListProps> = ({ productos }) => {
  return (
    <div>
      {productos.map((producto, i) => (
        <CartItem key={i} {...producto} />
      ))}
    </div>
  );
};

export default CartList;
