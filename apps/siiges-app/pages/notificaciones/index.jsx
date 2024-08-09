import React, { useContext, useEffect, useState } from 'react';
import fetchNotificaciones from '@siiges-ui/notificaciones';
import { useRouter } from 'next/router';
import { Layout, DataTable, Context } from '@siiges-ui/shared';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Divider, IconButton } from '@mui/material';
import Link from 'next/link';

const commonColumns = [
  { field: 'asunto', headerName: 'Asunto', width: 300 },
  { field: 'notificacion', headerName: 'Notificación', width: 650 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: ({ id }) => (
      <Link href={`/notificaciones/detallesNotificaciones/${id}`}>
        <IconButton aria-label="consultar">
          <ListAltIcon />
        </IconButton>
      </Link>
    ),
  },
];

const adminColumns = [
  { field: 'usuario', headerName: 'Usuario', width: 230 },
  { field: 'email', headerName: 'Correo electrónico', width: 200 },
  { field: 'asunto', headerName: 'Asunto', width: 150 },
  { field: 'notificacion', headerName: 'Notificación', width: 300 },
  { field: 'estatus', headerName: 'Estatus', width: 110 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 110,
    renderCell: ({ id }) => (
      <Link href={`/notificaciones/detallesNotificaciones/${id}`}>
        <IconButton aria-label="consultar">
          <ListAltIcon />
        </IconButton>
      </Link>
    ),
  },
];

export default function Notificaciones() {
  const { session } = useContext(Context);
  const { rol } = session;
  const router = useRouter();

  const { notificaciones } = fetchNotificaciones({ session, router });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (notificaciones && notificaciones.length) {
      const formattedRows = notificaciones.map((notificacion) => ({
        id: notificacion.id,
        asunto: notificacion.asunto,
        notificacion: notificacion.template,
        estatus: notificacion.status,
        ...(rol === 'admin' && {
          usuario: `${notificacion.usuario.persona.nombre} ${notificacion.usuario.persona.apellidoPaterno} ${notificacion.usuario.persona.apellidoMaterno}`,
          email: `${notificacion.usuario.correo}`,
        }),
        actions: 'Actions Placeholder',
      }));

      setRows(formattedRows);
    }
  }, [notificaciones]);

  return (
    <Layout title="Notificaciones">
      <Divider sx={{ mt: 2 }} />
      <DataTable rows={rows} columns={rol === 'admin' ? adminColumns : commonColumns} />
    </Layout>
  );
}
