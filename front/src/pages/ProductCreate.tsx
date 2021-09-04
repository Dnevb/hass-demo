import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { fetcher } from "..";

const ProductCreate = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  const inputs = [
    {
      register: register("nombre", { required: true }),
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      register: register("url_img", { required: true }),
      label: "Url de imagen",
      type: "url",
      required: true,
    },
    {
      register: register("descripcion"),
      label: "Descripcion",
      type: "text",
      required: false,
    },
    {
      register: register("cantidad", { required: true }),
      label: "Cantidad",
      type: "number",
      required: true,
    },
    {
      register: register("precio", { required: true }),
      label: "Precio",
      type: "number",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto max-w-xl pt-6">
      <h1 className="text-3xl font-sans font-bold">
        Creacion de producto
      </h1>
      <form
        onSubmit={handleSubmit((data) =>
          fetcher("http://localhost:4000/api/productos", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((res) => {
            console.log(res);
            history.push("/");
          })
        )}
      >
        {inputs.map(({ register, label, type, required }, i) => (
          <div className="my-4 mt-6" key={i}>
            <label className="pb-2 block text-lg font-medium text-gray-700">
              {label}
            </label>
            <input
              {...register}
              required={required}
              type={type}
              className="px-4 py-2 rounded-md border-gray-300 border-2 w-full"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-4 py-2 text-xl font-bold font-sans rounded-lg border border-transparent bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Crear
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
