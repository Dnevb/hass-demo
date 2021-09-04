import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const inputs = [
    {
      register: register("email", { required: true }),
      label: "Correo electronico",
      type: "email",
      required: true,
    },
    {
      register: register("pass", { required: true }),
      label: "Contraseña",
      type: "text",
      required: true,
    },
    {
      register: register("nombres", { required: true }),
      label: "Nombres",
      type: "text",
      required: true,
    },
    {
      register: register("apellidos", { required: true }),
      label: "Apellidos",
      type: "text",
      required: true,
    },
  ];

  return (
    <div className="h-full pt-16 flex flex-col items-center bg-gray-100">
      <div className="p-6 bg-white rounded  w-2/6">
        <h1 className="text-4xl text-center font-bold font-sans">
          Crear Cuenta
        </h1>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit((data) =>
            fetch("http://localhost:4000/api/register", {
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            })
              .then((res) => res.json())
              .then((res) => history.push("/login"))
          )}
        >
          {inputs.map(({ register, label, type, required }, i) => (
            <div className="my-1 mt-6">
              <label className="pb-2 block text-lg font-medium text-gray-700">
                {label}
              </label>
              <input
                required={required}
                {...register}
                type={type}
                className="px-5 py-3 rounded-md border-gray-300 border-2 w-full"
              />
            </div>
          ))}
          <button
            type="submit"
            className="px-5 py-3 text-xl rounded-lg border border-transparent bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
