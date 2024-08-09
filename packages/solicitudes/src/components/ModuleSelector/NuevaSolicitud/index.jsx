import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import { ButtonStyled, Context, useApi } from '@siiges-ui/shared';
import BasicSelect from '@siiges-ui/shared/src/components/Select';
import formData from '../../utils/sections/forms/formData';
import errorDatosNuevaSolicitud from '../../utils/sections/errors/errorDatosNuevaSolicitud';
import modalidades from '../../utils/Mocks/mockModalidades';

function NewRequest() {
  const { session, setNoti } = useContext(Context);
  const { data: planteles } = useApi({
    endpoint: `api/v1/planteles/usuarios/${session.id}`,
  });
  const router = useRouter();
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const [plantelesData, setPlantelesData] = useState([]);
  const [validation, setValidation] = useState([]);

  useEffect(() => {
    if (planteles) {
      setPlantelesData(planteles.map((plantel) => ({
        id: plantel.id,
        nombre: `${plantel.domicilio.calle} ${plantel.domicilio.numeroExterior}`,
      })));
    }
    if (error.plantel) {
      setNoti({
        open: true,
        message: 'Error al cargar los planteles',
        type: 'error',
      });
    }
  }, [planteles, error]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    formData(name, value, form, setForm);
  };

  const errors = errorDatosNuevaSolicitud(form, setError, error);

  const handleOnBlur = (e) => {
    const { name } = e.target;
    errors[name]();
  };

  const submit = () => {
    if (Object.values(validation).every((option) => option()) !== false) {
      if (Object.values(error).every((value) => value === null || value === '')) {
        const { modalidad, plantel } = form;
        router.push(
          {
            pathname: '/solicitudes/nuevaSolicitud',
            query: { modalidad, plantel },
          },
          '/solicitudes/nuevaSolicitud',
        );
      }
    }
  };

  useEffect(() => {
    if (errors !== undefined) {
      setValidation(errors);
    }
  }, [error]);

  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <BasicSelect
            title="Modalidad"
            name="modalidad"
            value=""
            options={modalidades}
            onchange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.modalidad}
            required
          />
        </Grid>
        <Grid item xs={5}>
          <BasicSelect
            title="Plantel"
            name="plantel"
            value=""
            options={plantelesData}
            onchange={handleOnChange}
            onblur={handleOnBlur}
            errorMessage={error.plantel}
            required
          />
        </Grid>
        <Grid item xs={2} sx={{ mt: 2, mb: 1 }}>
          <div style={{ height: '100%' }}>
            <ButtonStyled onclick={submit} text="Crear" alt="Crear" />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default NewRequest;
