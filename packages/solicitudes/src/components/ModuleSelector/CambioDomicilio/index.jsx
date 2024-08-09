import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ButtonStyled, Context, Select, useApi,
} from '@siiges-ui/shared';
import React, { useEffect, useState, useContext } from 'react';

function ChangeAddress() {
  const { setNoti, session: { id } } = useContext(Context);
  const router = useRouter();
  const [programaData, setProgramaData] = useState([]);
  const [programaSelect, setProgramaSelect] = useState('');
  const [plantelData, setPlantelData] = useState([]);
  const [plantelSelect, setPlantelSelect] = useState('');
  const [url, setUrl] = useState('');
  const [dataBody, setDataBody] = useState('');
  const [method, setMethod] = useState('GET');

  const { data } = useApi({
    endpoint: url || `api/v1/solicitudes?estatusSolicitudId=11&usuarioId=${id}`,
    dataBody,
    method,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      if (!programaData.length) {
        const newData = data.map(({ id: programaId, programa, folio }) => ({
          id: programaId,
          nombre: `${programa.nombre} ${folio} ${programa.plantel.institucion.nombre}`,
          plantelId: programa.plantel.id,
        }));
        setProgramaData(newData);
        setUrl(`api/v1/planteles/usuarios/${id}`);
      }
      if (!plantelData.length && programaData.length) {
        const selectedProg = programaData.find((prog) => prog.id === programaSelect);
        const newData = data
          .filter(({ id: plantelId }) => selectedProg && plantelId !== selectedProg.plantelId)
          .map(({ id: plantelId, domicilio }) => ({
            id: plantelId,
            nombre: `${domicilio.calle} ${domicilio.numeroExterior} ${domicilio.colonia} ${domicilio.municipio.nombre}`,
          }));
        setPlantelData(newData);
      }
    }
    if (typeof data === 'object' && method === 'POST' && data) {
      setNoti({
        open: true,
        message: 'Registro Exitoso',
        type: 'success',
      });
      router.push({
        pathname: `/solicitudes/detallesSolicitudes/${data.id}/editarSolicitud`,
      });
    }
  }, [data, programaSelect]);

  const handleOnClick = () => {
    if (programaSelect && plantelSelect) {
      setMethod('POST');
      setDataBody({ usuarioId: id });
      setUrl(`api/v1/solicitudes/${programaSelect}/cambioDomicilio/${plantelSelect}`);
    }
  };

  return (
    <Grid item>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Select
            title="Programa"
            name="programa"
            value={programaSelect}
            options={programaData || []}
            onchange={(event) => {
              setProgramaSelect(event.target.value || '');
              setPlantelData([]);
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <Select
            title="Plantel"
            name="plantel"
            value={plantelSelect}
            options={plantelData || []}
            onchange={(event) => setPlantelSelect(event.target.value || '')}
          />
        </Grid>
        <Grid item xs={2} sx={{ mt: 2, mb: 1 }}>
          <ButtonStyled text="Crear" onclick={() => handleOnClick()} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChangeAddress;
