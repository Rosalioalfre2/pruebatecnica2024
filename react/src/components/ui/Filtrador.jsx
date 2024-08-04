/* eslint-disable react/prop-types */
import { TextInput, Label, Accordion, Button, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { FaSearch, FaBroom } from "react-icons/fa";
import { useEffect, useState } from "react";
import { handlerApi } from "@/api/api";

const Filtrador = ({
  setFiltro,
  items = [],
  setPagination,
  pagination,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    let cleanData = "";
    setPagination({
      ...pagination,
      currentPage: 1,
    });

    Object.entries(data).forEach(([key, value]) => {
      if (value !== "") {
        cleanData += `&${key}=${value}`;
      }
    });
    setFiltro(cleanData);
  });

  return (
    // Verifica si items no está vacío antes de renderizar el Accordion
    items.length > 0 && (
      <Accordion>
        <Accordion.Panel>
          <Accordion.Title className="p-2">Filtros</Accordion.Title>
          <Accordion.Content className="bg-gray-400 p-2">
            <form
              className="grid gap-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              onSubmit={onSubmit}
            >
              <>
                {items.map((item, index) => (
                  <div key={index}>
                    <div className="flex h-full flex-col gap-2 rounded bg-gray-300 p-3 dark:bg-gray-800">
                      <Label>{item.label}</Label>
                      <div>
                        {["text"].includes(item.type.trim().toLowerCase()) && (
                          <TextInput
                            className="w-full"
                            type={item.type}
                            autoComplete="off"
                            {...register(`${item.fieldName}__contains`)}
                          />
                        )}
                        {["number"].includes(
                          item.type.trim().toLowerCase(),
                        ) && (
                          <div className="flex flex-col gap-2">
                            <TextInput
                              className="w-full"
                              type={item.type}
                              step="any"
                              placeholder="Minimo"
                              autoComplete="off"
                              {...register(`${item.fieldName}__gte`)}
                            />
                            <TextInput
                              className="w-full"
                              type={item.type}
                              step="any"
                              placeholder="Maximo"
                              autoComplete="off"
                              {...register(`${item.fieldName}__lte`)}
                            />
                          </div>
                        )}
                        {["date"].includes(item.type.trim().toLowerCase()) && (
                          <>
                            <div className="flex w-full flex-row items-center gap-2">
                              <Label className="w-1/5">Inicio</Label>
                              <input
                                type={item.type}
                                autoComplete="off"
                                className={clsx(
                                  "bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2",
                                )}
                                {...register(`${item.fieldName}__gte`)}
                              />
                            </div>
                            <div className="flex w-full flex-row items-center gap-2">
                              <Label className="w-1/5">Fin</Label>
                              <input
                                type={item.type}
                                autoComplete="off"
                                className={clsx(
                                  "min-w-fit bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2",
                                )}
                                {...register(`${item.fieldName}__lte`)}
                              />
                            </div>
                          </>
                        )}
                        {["select"].includes(
                          item.type.trim().toLowerCase(),
                        ) && (
                          <SelectFiltrador
                            ruta={item.ruta}
                            text={item.text}
                            value={item.value}
                            setValue={setValue}
                            fieldName={item.fieldName}
                            getBy={item.getBy}
                            // {...register(`${item.fieldName}__contains`)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
              <div className="flex items-center justify-center gap-2">
                <Button type="submit" color="blue" className="w-full">
                  Filtrar
                  <FaSearch className="ml-1" />
                </Button>
                <Button
                  className="w-full"
                  color="failure"
                  onClick={() => {
                    setFiltro("");
                    reset();
                  }}
                >
                  Limpiar
                  <FaBroom className="ml-1" />
                </Button>
              </div>
            </form>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    )
  );
};

export { Filtrador };

const SelectFiltrador = ({
  text = "name",
  value = "id",
  ruta,
  fieldName,
  setValue,
  getBy,
  // ...props
}) => {
  const [options, setOptions] = useState([]);

  const getOptions = async () => {
    const response = await handlerApi(ruta ?? "", "getPag", {
      getBy: getBy,
    });

    if (response.data.results && Array.isArray(response.data.results)) {
      setOptions(response.data.results);
    } else if (response.data && Array.isArray(response.data)) {
      setOptions(response.data);
    }
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <Select
      className="w-full"
      onChange={(item) => setValue(fieldName, item.target.value)}
    >
      <option value=""></option>
      {options.map((op, index) => (
        <option value={op[value]} key={index}>
          {op[text]}
        </option>
      ))}
    </Select>
  );
};
