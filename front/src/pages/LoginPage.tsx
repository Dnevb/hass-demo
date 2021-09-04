import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { mutate } from "swr";
import { AuthContext } from "../providers/auth";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const auth = useContext(AuthContext);

  return (
    <div className="h-full pt-16 flex flex-col items-center bg-gray-100">
      <div className="p-6 bg-white rounded  w-2/6">
        <h1 className="text-4xl text-center font-bold font-sans">
          Iniciar Sesion
        </h1>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit((data) =>
            fetch("http://localhost:4000/api/login", {
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.token) {
                  auth?.login(res.token);
                }
              })
          )}
        >
          <div className="my-4 mt-6">
            <label className="pb-2 block text-lg font-medium text-gray-700">
              Correo electronico
            </label>
            <input
              required
              {...register("email", { required: true })}
              type="email"
              className="px-5 py-3 rounded-md border-gray-300 border-2 w-full"
            />
          </div>
          <div className="my-4 mb-6">
            <label className="pb-2 block text-lg font-medium text-gray-700">
              Contraseña
            </label>
            <input
              required
              {...register("pass", { required: true })}
              type="password"
              className="px-5 py-3 rounded-md border-gray-300 border-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 text-xl rounded-lg border border-transparent bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
