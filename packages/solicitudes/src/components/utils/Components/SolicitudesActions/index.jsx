import { Grid, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ButtonsForm,
  Context,
  DefaultModal,
  deleteRecord,
} from '@siiges-ui/shared';

function SolicitudesActions({ id, estatus }) {
  const { session, setNoti } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [consultLink, setConsultLink] = useState(`/solicitudes/detallesSolicitudes/${id}`);
  const [showButtons, setShowButtons] = useState({
    consultar: true,
    editar: false,
    eliminar: false,
  });

  useEffect(() => {
    switch (session.rol) {
      case 'representante':
        setShowButtons({
          consultar: true,
          editar: estatus === 1 || estatus === 200,
          eliminar: estatus === 1 || estatus === 200,
        });
        break;
      case 'control_documental':
        setConsultLink(`/solicitudes/detallesSolicitudes/${id}/recepcionFormatos`);
        setShowButtons({
          consultar: estatus === 3,
          editar: estatus === 2,
          eliminar: false,
        });
        break;
      default:
        setShowButtons({ consultar: true, editar: false, eliminar: false });
        break;
    }
  }, [session.rol]);

  const handleDelete = async () => {
    const response = await deleteRecord({ endpoint: `/solicitudes/${id}` });

    if (response.statusCode === 200) {
      setNoti({
        open: true,
        message: 'Solicitud eliminada exitosamente',
        type: 'success',
      });
      setOpen(false);
    } else {
      setNoti({
        open: true,
        message: response.errorMessage || 'Hubo un problema al eliminar la solicitud',
        type: 'error',
      });
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {showButtons.consultar && (
          <Grid item xs={4}>
            <Link href={consultLink} passHref>
              <IconButton aria-label="consultar">
                <ListAltIcon />
              </IconButton>
            </Link>
          </Grid>
        )}
        {showButtons.editar && (
          <Grid item xs={4}>
            <Link
              href={`/solicitudes/detallesSolicitudes/${id}/editarSolicitud`}
              passHref
            >
              <IconButton aria-label="editar">
                <EditIcon />
              </IconButton>
            </Link>
          </Grid>
        )}
        {showButtons.eliminar && (
          <Grid item xs={4}>
            <IconButton aria-label="eliminar" onClick={() => setOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <DefaultModal title="Eliminar solicitud" open={open} setOpen={setOpen}>
  <Typography>
    ¿Está seguro que quiere eliminar esta solicitud?
  </Typography>
  <ButtonsForm cancel={() => setOpen(false)} confirm={handleDelete} confirmText="Confirmar"/>
</DefaultModal>
    </>
  );
}

SolicitudesActions.propTypes = {
  id: PropTypes.number.isRequired,
  estatus: PropTypes.number.isRequired,
};

export default SolicitudesActions;
