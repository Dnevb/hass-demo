import { FC, useState } from "react";
import { MdClose } from "react-icons/md";

const Modal = require("react-modal");

interface ModalProps {
  state: [boolean, Function];
  data: any[];
}

const ModalCompra: FC<ModalProps> = ({ state, data }) => {
  return (
    <Modal
      isOpen={state[0]}
      style={{
        content: {
          maxWidth: "40rem",
          zIndex: 50,
          margin: "0 auto",
          backgroundColor: "white",
        },
      }}
    >
      <div className="h-12 flex justify-between items-center">
        <h1>Productos</h1>
        <button onClick={() => state[1](false)}>
          <MdClose />
        </button>
      </div>
      {data
        ? data.map((producto) => (
            <div className="py-3 border-b border-black">
              <h1>{producto.nombre}</h1>
            </div>
          ))
        : "ahuans"}
    </Modal>
  );
};

export default ModalCompra;
