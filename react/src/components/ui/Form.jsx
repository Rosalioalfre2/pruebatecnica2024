/* eslint-disable react/prop-types */
import clsx from "clsx";
import {
  Label as FBLabel,
  TextInput as FBTextInput,
  Checkbox as FBCheckbox,
  // FileInput as FBFileInput,
  // Datepicker as FBDatepicker,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { notify } from "@/components/toast";
import { handlerApi } from "@/api/api";
import ReactSelect from "react-select";
import InputMask from "react-input-mask";
// import { ruta } from "@/libs/axios";
import { useThemeMode } from "flowbite-react";

const Form = ({
  className,
  children,
  onSubmit,
  ...props
}) => {
  return (
    <>
      <form
        className={clsx(
          "flex flex-wrap min-w-fit w-full max-w-full flex-col justify-items-center items-center gap-4 content-center",
          className,
        )}
        onSubmit={onSubmit}
        encType="multipart/form-data"
        {...props}
      >
        {children}
      </form>
    </>
  );
};

const Datepicker = ({
  type,
  register,
  fieldName,
  errors,
  validation,
  className,
  ...props
}) => {
  return (
    <>
      <input
        type={type}
        autoComplete="off"
        className={clsx(
          "w-full bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2",
          className,
        )}
        {...register(fieldName, validation)}
        {...props}
      ></input>
      <Message message={errors?.[fieldName]?.message}></Message>
    </>
  );
};

const Label= ({
  color,
  label,
  fieldname,
  className,
  isRequired = false,
  ...props
}) => {
  return (
    <div className={clsx("mb-1", className)}>
      <FBLabel
        htmlFor={fieldname}
        color={color ?? ""}
        value={label}
        className={clsx("dark:text-white")}
        {...props}
      />
      <span className="text-red-700 dark:text-red-500">
        {isRequired ? "*" : ""}
      </span>
    </div>
  );
};

const TextInput = ({
  type,
  register,
  fieldName,
  errors,
  className,
  validation,
  setValue,
  theValue,
  inputmask = "",
  watch,
  ...props
}) => {
  useEffect(() => {
    if (theValue != undefined) {
      setValue(fieldName, theValue);
    }
  }, []);

  return (
    <>
      {inputmask != "" && (
        <>
          <InputMask
            type={type}
            {...register(fieldName, validation)}
            autoComplete="off"
            className={clsx(
              "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-md w-full disabled:bg-gray-300 dark:disabled:bg-gray-900 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:cursor-not-allowed",
              className,
            )}
            value={watch(fieldName) ?? ""}
            onChange={(e) => {
              setValue(fieldName, e.target.value);
            }}
            mask={inputmask}
            {...props}
          />
          <Message message={errors?.[fieldName]?.message} />
        </>
      )}
      {inputmask == "" && (
        <>
          <FBTextInput
            type={type}
            {...register(fieldName, validation)}
            helperText={<Message message={errors?.[fieldName]?.message} />}
            autoComplete="off"
            className={clsx(className)}
            {...props}
          />
        </>
      )}
    </>
  );
};

const Message = ({
  message,
  isOk = false,
  className,
  ...props
}) => {
  return (
    <>
      <span
        className={clsx(
          isOk
            ? "text-green-700 dark:text-green-500 hidden"
            : "text-red-700 dark:text-red-500",
          className,
        )}
        {...props}
      >
        {message}
      </span>
    </>
  );
};

const CheckBox = ({
  register,
  fieldName,
  errors,
  validation,
  value,
  ...props
}) => {
  return (
    <>
      <FBCheckbox
        {...register(fieldName, validation)}
        defaultChecked={value ?? false}
        {...props}
      />
      <Message message={errors?.[fieldName]?.message}></Message>
    </>
  );
};

const Select= ({
  ruta,
  // className,
  errors,
  fieldName,
  register,
  validation,
  setName = "nombre",
  setId = "id",
  watch,
  customOptions = [],
  isDependent = false,
  depedentFieldName = "",
  setValue,
  getBy = {},
  getBy2 = {},
  ...props
}) => {
  const [options, setOptions] = useState([...customOptions]);
  const [selectValue, setSelectValue] = useState("");
  const { mode } = useThemeMode();

  let tenant = "";

  const getOptions = async () => {
    if (
      isDependent &&
      (depedentFieldName == "" ||
        watch(depedentFieldName) == "" ||
        watch(depedentFieldName) == undefined)
    ) {
      return;
    }

    if (ruta == "" || ruta == undefined) {
      return;
    }

    const response = isDependent
      ? await handlerApi(ruta ?? "", "getPag", {
          tenant,
          getBy: [
            { [depedentFieldName]: watch(depedentFieldName) },
            getBy,
            getBy2,
          ],
        })
      : await handlerApi(ruta ?? "", "getPag", {
          tenant,
          getBy: [getBy, getBy2],
        });
    if (!response.status || response.status !== 200) {
      notify("Ha ocurrido un error en la petición", "error");
    } else {
      if (Array.isArray(response.data.results)) {
        setOptions([...customOptions, ...response.data.results]);
        if (isDependent) {
          setValue(fieldName, "");
        }
      } else {
        notify("Hubo un error en la petición", "error");
      }
    }
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    if (isDependent) {
      getOptions();
    }
  }, [watch(depedentFieldName)]);

  useEffect(() => {
    setSelectValue(watch(fieldName));
  }, [watch]);

  return (
    <>
      <ReactSelect
        {...register(fieldName, validation)}
        classNames={{
          valueContainer: () =>
            "bg-gray-100 dark:bg-gray-700 text-black dark:text-white",
          indicatorsContainer: () =>
            "bg-gray-100 dark:bg-gray-700 text-black dark:text-white",
          menuList: () =>
            "bg-gray-100 dark:bg-gray-700 text-black dark:text-white",
          singleValue: () => "text-base dark:text-white",
        }}
        onChange={(e) => {
          if (e == null) {
            setValue(fieldName, "");
            setSelectValue("");
            return;
          }
          if (Array.isArray(e)) {
            setValue(
              fieldName,
              e.map((item) => item.value),
            );
            setSelectValue(e.value);
            return;
          }
          setValue(fieldName, e.value);
          setSelectValue(e.value);
        }}
        options={options.map((option) => ({
          value: option[setId],
          label: option[setName],
        }))}
        value={
          Array.isArray(selectValue)
            ? options
                .map((option) => ({
                  value: option[setId],
                  label: option[setName],
                }))
                .filter((option) => selectValue.includes(option.value))
            : options
                .map((option) => ({
                  value: option[setId],
                  label: option[setName],
                }))
                .find((option) => option.value === selectValue)
        }
        isSearchable
        placeholder="Seleccione una opcion"
        isClearable
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: mode === "light" ? "white" : "#333",
            color: mode === "light" ? "#000" : "#fff",
            borderColor: state.isFocused
              ? mode === "light"
                ? "#000"
                : "#fff"
              : provided.borderColor,
            boxShadow: state.isFocused
              ? `0 0 0 1px ${mode === "light" ? "#000" : "#fff"}`
              : provided.boxShadow,
            "&:hover": {
              borderColor: state.isFocused
                ? mode === "light"
                  ? "#000"
                  : "#fff"
                : provided.borderColor,
            },
          }),
          singleValue: (provided) => ({
            ...provided,
            color: mode === "light" ? "#000" : "#fff",
          }),
          input: (provided) => ({
            ...provided,
            color: mode === "light" ? "#000" : "#fff",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: mode === "light" ? "#999" : "#ccc",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: mode === "light" ? "white" : "#333",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? mode === "light"
                ? "#ddd"
                : "#555"
              : state.isSelected
                ? mode === "light"
                  ? "#ccc"
                  : "#444"
                : "transparent",
            color: mode === "light" ? "#000" : "#fff",
            "&:hover": {
              backgroundColor: mode === "light" ? "#ddd" : "#555",
              color: mode === "light" ? "#000" : "#fff",
            },
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: mode === "light" ? "gray" : "#17202A",
            primary: mode === "light" ? "black" : "#111",
            neutral0: "white", // Fondo de la opción en modo claro
            neutral20: mode === "light" ? "#333" : "#111", // Color de borde en modo oscuro
            neutral30: mode === "light" ? "#333" : "#111", // Color del texto en modo oscuro
            neutral40: mode === "light" ? "#333" : "#111", // Color del texto en modo oscuro al pasar el ratón
          },
        })}
        {...props}
      ></ReactSelect>
      <Message message={errors?.[fieldName]?.message} />
    </>
  );
};

const FileInput = ({
  register,
  fieldName,
  errors,
  validation,
  watch,
  setValue,
  ...props
}) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (watch("id") != undefined) {
      if (typeof watch(fieldName) == "string") {
        setPreview(watch(fieldName));
      }
      setValue(fieldName, null);
    }
  }, []);
  return (
    <>
      <div className="flex w-full">
        {watch("id") == undefined && (
          <input
            className={clsx(
              "w-full bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2",
            )}
            type="file"
            {...props}
            {...register(fieldName, validation)}
          />
        )}
        {watch("id") != undefined && (
          <div className="flex flex-col">
            <input
              className={clsx(
                "w-full bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2",
              )}
              type="file"
              {...props}
              {...register(fieldName, validation)}
            />
            {watch(fieldName) == null && (
              <>
                <img
                  src={`${preview}`}
                  alt={preview ?? "No encontrado"}
                  className="max-w-64"
                />
              </>
            )}
          </div>
        )}
      </div>
      <Message message={errors?.[fieldName]?.message}></Message>
    </>
  );
};

export {
  Form,
  Label,
  TextInput,
  Message,
  CheckBox,
  Select,
  Datepicker,
  FileInput,
};
