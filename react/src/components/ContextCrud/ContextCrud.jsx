/* eslint-disable react/prop-types */
import { BasicTable, IForm, Container, Row, Col, Filtrador } from "@/components/ui/Index";
import { handlerApi } from "@/api/api";
import { useEffect, useState } from "react";
import { notify } from "@/components/toast";
import { Label, TextInput, Button, Select } from "flowbite-react";
import { Pagination } from '@nextui-org/react'
import { useEnterprise } from "@/context/LocationContext";
import {Alert} from 'flowbite-react'
import { Viewer } from "@/components/ui/Viewer";
import { useCrud } from "./Context";

const ContextCrud = ({
  ruta,
  formulario,
  baseColumns,
  filtros,
  getBy = [],
  tenant = false,
  showActionsColumn = true,
  actionColumnsValidation = true,
  showAddButton = true,
  masAcciones,
  message,
  viewer,
  showTable=true
}) => {
  const {
    handleSubmit,
    register,
    errors,
    setValue,
    reset,
    watch,
    unregister,
    setError,
    modal,
    setModal,
    filtro,
    setFiltros,
    pagination,
    setPagination,
    openViewer,
    setOpenViewer,
    dataViewer,
    setDataViewer,
    objects,
    setObjects,
    reload,
    lengthPagination,
    alerta,
    setAlerta,
    registerChange,
    loadingForm,
    setLoadingForm,
  } = useCrud();

  const { empresa } = useEnterprise();
  const [loadingPag, setLoadingPag] = useState(false)

  const toogleModal = (resetear = false) => {
    resetear ? reset() : "";
    setModal(!modal);
  };
  
  useEffect(()=>{
    setAlerta({warnings: [], errors: []})
  }, [modal])

  const onSubmit = handleSubmit(async (data) => {
    setAlerta({warnings: [], errors: []})

    if (tenant && empresa.tenant == "") {
      notify("Seleccione una empresa!!!", "error");
      return;
    }
    data.tenant = tenant ? empresa.tenant : "";
    try {
      setLoadingForm(true)
      if (data.id !== undefined) {
        const response = await handlerApi(ruta, "update", data);
        if (!response.status || response.status !== 200) {
          notify("Algo salió mal, vuelva a intentar", "error");
          return;
        }
      } else {
        const response = await handlerApi(ruta, "create", data);
        if (response.status !== 201) {
          notify("Algo salió mal, vuelva a intentar", "error");
          return;
        }
      }

      reset();
      setModal(false);
      loadObjects();
      notify("Se guardó correctamente", "success");
    } catch (error) {
      // setFormBanner(JSON.stringify(error.response.data, null, 2));
      notify("Algo salió mal, vuelva a intentar", "error");

      const llaves = formulario.items.filter((item)=>item != null && item.fieldName !=null).map((item) => item.fieldName);
      
      if(error.response.data){
        if (error.response.status == 400){
          const llavesReponse = Object.keys(error.response.data)
          const errors = []
          const warnings = []

          llavesReponse.map((llaveResponse)=>{
            if(llaves.includes(llaveResponse)){
              setError(llaveResponse, {
                type: "validate",
                message: JSON.stringify(error.response.data[llaveResponse], null, 2)
              })
            }
            else{
              if(llaveResponse == "warnings"){
                warnings.push({llave: llaveResponse, articulos: error.response.data[llaveResponse]})
              }
              else if(llaveResponse == "errors"){
                errors.push({llave: llaveResponse, articulos: error.response.data[llaveResponse]})
              }
              else{
                errors.push({llave: llaveResponse, articulos: error.response.data[llaveResponse]})
              }
            }

            setAlerta({errors, warnings})
          })
        }
        else if(error.response.status == 403){
          notify("Usted no tiene permiso para realizar esta accion. Status 403", "error")
        }
      }
    } finally{
      registerChange()
      setLoadingForm(false)
    }
  });

  const deleteById = async (id) => {
    if (tenant && empresa.tenant == "") {
      notify("Seleccione una empresa!!!", "error");
      return;
    }
    try {
      const response = await handlerApi(ruta, "delete", {
        id,
        tenant: tenant ? empresa.tenant : "",
      });
      if (response.status != 204) {
        notify("Algo salió mal al intentar eliminar este registro.", "error");
        return;
      }
    } catch (error) {
      notify("Algo salió mal al intentar eliminar este registro.", "error");
      return;
    }

    if (pagination.currentPage != 1 && objects.length % pagination.items == 1) {
      setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
    }

    loadObjects();
    notify("Se eliminó correctamente", "success");
  };

  const handleUpdate = (object) => {
    reset();
    toogleModal();
    for (const key in object) {
      setValue(key, object[key]);
    }
  };

  const loadObjects = async () => {
    if (tenant && empresa.tenant == "") {
      notify("Seleccione una empresa!!!", "error");
      return;
    }
    try {
      setLoadingPag(true)
      const response = await handlerApi(ruta, "getPag", {
        page: pagination.currentPage,
        page_size: pagination.items,
        filtro: filtro,
        tenant: tenant ? empresa.tenant : "",
        getBy,
      });
      setPagination({
        ...pagination,
        totalPages: Math.max(
          Math.ceil(response.data.count / pagination.items),
          1,
        ),
      });
      setObjects(response.data.results);
    } catch (error) {
      notify("Ha ocurrido un error al solicitar los datos", "error");
    }
    finally{
      setLoadingPag(false)
    }
  };

  const onPageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  useEffect(() => {
    loadObjects();
  }, [pagination.currentPage, pagination.items, filtro, empresa]);

  useEffect(() => {
    if(reload != 0){
      loadObjects()
    }
  }, [reload])
  

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <>
              {viewer && viewer?.decorator && <Viewer modal={{openModal:openViewer, setOpenModal: setOpenViewer, title: viewer?.title ?? ""}} data={{data:dataViewer, decorator: viewer?.decorator }} />}
            </>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col size={50}>
            <IForm
              formulario={formulario}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              modal={modal}
              toogleModal={toogleModal}
              watch={watch}
              setValue={setValue}
              unregister={unregister}
              setError={setError}
              showAddButton={showAddButton}
              alerta={alerta}
              loadingForm={loadingForm}
            />
          </Col>
          {showTable && (
          <Col size={50}>
            <div className="flex flex-col justify-end gap-4 md:flex-row">
              <div className="hidden flex-col items-start justify-start gap-4 md:flex-row md:items-center">
                <Label htmlFor="buscador">Buscador</Label>
                <TextInput
                  className="min-w-16"
                  id="buscador"
                  type="text"
                ></TextInput>
                <Button color="primary">Buscar</Button>
              </div>
              <Select
                onChange={(e) => {
                  setPagination({
                    ...pagination,
                    currentPage: 1,
                    items: parseInt(e.target.value),
                  });
                }}
                className="min-w-fit max-w-fit"
              >
                {lengthPagination.map((item, index)=><option value={item} key={index}>Ver {item}</option>)}
              </Select>
            </div>
          </Col>
          )}
        </Row>
        {showTable && (<>
        <Row className="mb-3">
          <Col>
            <Filtrador setFiltro={setFiltros} items={filtros} setPagination={setPagination} pagination={pagination} />
          </Col>
        </Row>
        {message && (
        <Row className="mb-2">
          <Col>
            <Alert color={message.color ?? "info"} className="text-base" icon={message.icon} >
              <span className="font-medium">{message.span ?? ""}</span>{message.message}
            </Alert>
          </Col>
        </Row>
        )}
        <Row>
          <Col>
            <BasicTable
              data={objects}
              baseColumns={baseColumns}
              handleUpdate={handleUpdate}
              deleteObject={deleteById}
              showActionsColumn={showActionsColumn}
              actionColumnsValidation={actionColumnsValidation}
              masAcciones={masAcciones}
              viewer={{setOpenModal: setOpenViewer, setDataViewer: setDataViewer}}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Pagination
              // setPage={pagination.currentPage}
              page={pagination.currentPage}
              total={pagination.totalPages}
              onChange={onPageChange}
              showControls
              initialPage={1}
              isDisabled={loadingPag}
              loop
              variant="bordered"
              boundaries={3}
            />
          </Col>
        </Row>
        </>)}
      </Container>
    </div>
  );
};

export { ContextCrud };
