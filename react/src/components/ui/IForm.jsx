/* eslint-disable react/prop-types */
import React from "react";
import {
  Modal,
  Form,
  Select,
  CheckBox,
  Datepicker,
  Container,
  Row,
  Col,
  FileInput,
} from "./Index";
import { TextInput, Label } from "@/components/ui/Index";
import clsx from "clsx";
import { Alert } from "flowbite-react";
import { Button } from "@nextui-org/react";
import {
  messageValidation,
  typeValidation,
  getPlaceholder,
  getInputmask,
} from "@/hooks/Index";
import { HiInformationCircle } from "react-icons/hi";

const IForm = ({
  formulario,
  onSubmit,
  register,
  errors,
  modal,
  toogleModal,
  setValue,
  // unregister,
  // setError,
  watch,
  showAddButton = true,
  alerta = { warnings: [], errors: [] },
  loadingForm = false,
}) => {
  return (
    <>
      <Modal
        openBtnTxt={formulario.addTxt}
        title={formulario.title}
        modal={modal}
        toogleModal={() => toogleModal(true)}
        size="7xl"
        btnColor="success"
        showAddButton={showAddButton}
      >
        <Form onSubmit={onSubmit}>
          <Container>
            <Row>
              <Col>
                <>
                  {formulario?.formBanner && (
                    <Alert
                      color={formulario?.formBanner?.color ?? "failure"}
                      icon={HiInformationCircle}
                      className="my-1"
                    >
                      {formulario?.formBanner?.text ?? ""}
                    </Alert>
                  )}
                  {alerta.errors != undefined && alerta.warnings.length > 0 && (
                    <Alert color="warning" className="my-2 flex flex-col gap-2">
                      {alerta.warnings != undefined &&
                        alerta.warnings.length > 0 &&
                        alerta.warnings.map((warning, index) => (
                          <div key={index}>
                            <span className="mr-2 font-bold">
                              {warning["llave"]}:
                            </span>
                            <span className="mr-2">
                              {warning["articulos"].map(
                                (articulo) => `${articulo}`,
                              )}
                            </span>
                          </div>
                        ))}
                    </Alert>
                  )}
                  {alerta.errors != undefined && alerta.errors.length > 0 && (
                    <Alert color="failure" className="my-2 flex flex-col gap-2">
                      {alerta.errors.map((errors, index) => (
                        <div key={index}>
                          <span className="mr-2 font-bold">
                            {errors["llave"]}:
                          </span>
                          <span className="mr-2">
                            {errors["articulos"].map(
                              (articulo) => `${articulo}`,
                            )}
                          </span>
                        </div>
                      ))}
                    </Alert>
                  )}
                </>
              </Col>
            </Row>
            <Row>
              {formulario.items.map((item, index) => (
                <React.Fragment key={index}>
                  {item != null && (
                    <>
                      <Col key={index} size={item.size ?? 100}>
                        <div className={clsx("w-full")}>
                          <Label
                            label={item.label}
                            fieldname={item.fieldName}
                            isRequired={
                              item.validation?.required || item.required
                                ? true
                                : false
                            }
                          />
                          {["hidden"].includes(
                            item.type.toLowerCase().trim(),
                          ) && (
                            <input
                              type={item.type}
                              {...register(item.fieldName)}
                              value={item["value"]}
                            />
                          )}
                          {["text", "number", "password", "url"].includes(
                            item.type.toLowerCase(),
                          ) && (
                            <TextInput
                              {...item}
                              register={register}
                              errors={errors}
                              validation={messageValidation(item.validation)}
                              required={false}
                              setValue={setValue}
                              theValue={item.theValue}
                              inputmask={item.inputmask}
                              watch={watch}
                            />
                          )}
                          {[
                            "name",
                            "dui",
                            "email",
                            "nit",
                            "tel",
                            "codigo_fel_dep",
                            "codigo_fel_mun",
                            "codigo",
                            "direccion",
                          ].includes(item.type.toLowerCase().trim()) && (
                            <TextInput
                              {...item}
                              register={register}
                              errors={errors}
                              validation={messageValidation(
                                typeValidation(item.type, item.required),
                              )}
                              placeholder={
                                item.placeholder ?? getPlaceholder(item.type)
                              }
                              inputmask={
                                item.inputmask ?? getInputmask(item.type)
                              }
                              type="text"
                              required={false}
                              setValue={setValue}
                              theValue={item.theValue}
                              watch={watch}
                            />
                          )}
                          {["select"].includes(
                            item.type.toLowerCase().trim(),
                          ) && (
                            <Select
                              {...item}
                              fieldName={item.fieldName}
                              register={register}
                              errors={errors}
                              ruta={item.ruta}
                              setName={item.setName}
                              setId={item.setId}
                              customOptions={item.selectOptions}
                              validation={messageValidation(item.validation)}
                              watch={watch}
                              isTenant={item.isTenant ?? false}
                              isDependent={item.isDependent ?? false}
                              depedentFieldName={item.depedentFieldName ?? ""}
                              setValue={setValue}
                              getBy={item.getBy}
                            />
                          )}
                          {["date"].includes(
                            item.type.toLowerCase().trim(),
                          ) && (
                            <Datepicker
                              {...item}
                              register={register}
                              errors={errors}
                              {...item}
                              validation={messageValidation(
                                typeValidation(item.type, item.required),
                              )}
                              type={item.type}
                            />
                          )}
                          {["checkbox"].includes(
                            item.type.toLowerCase().trim(),
                          ) && (
                            <CheckBox
                              {...item}
                              fieldName={item.fieldName}
                              register={register}
                              errors={errors}
                              value={item.value ?? false}
                              validation={messageValidation(item.validation)}
                            />
                          )}
                          {["file"].includes(
                            item.type.toLowerCase().trim(),
                          ) && (
                            <FileInput
                              {...item}
                              fieldName={item.fieldName}
                              register={register}
                              errors={errors}
                              validation={messageValidation(item.validation)}
                              watch={watch}
                              setValue={setValue}
                            />
                          )}
                          {["component"].includes(
                            item.type.toLowerCase().trim(),
                          ) && <>{item.component}</>}
                        </div>
                        <p className="text-xs text-black dark:text-white">
                          {item.infotext ?? ""}
                        </p>
                      </Col>
                    </>
                  )}
                </React.Fragment>
              ))}
            </Row>
            <Row>
              <Col>
                <Button
                  className="mt-2"
                  type="submit"
                  color="primary"
                  isLoading={loadingForm}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal>
    </>
  );
};

export { IForm };
