import {
  List, ListItem, ListItemText, Grid, Typography,
} from '@mui/material';
import { Context, Layout, Title } from '@siiges-ui/shared';
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSolicitudDetalles } from '@siiges-ui/solicitudes';
import GenerarFDA01 from '../FDA/FDA01';
import GenerarFDA02 from '../FDA/FDA02';
import GenerarFDA04 from '../FDA/FDA04';
import GenerarFDA06 from '../FDA/FDA06';

export default function detallesSolicitudes() {
  const { session, setNoti } = useContext(Context);
  const router = useRouter();
  const { query } = router;
  const [solicitudData, setSolicitudData] = useState({});
  const [plantelData, setPlantelData] = useState({});

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (query.id !== undefined) {
        try {
          const { plantel, solicitud } = await getSolicitudDetalles(
            query.id,
            session,
            setNoti,
          );
          setSolicitudData(solicitud);
          setPlantelData(plantel);
        } catch (error) {
          console.error('Error fetching solicitud:', error);
        }
      }
    };

    fetchSolicitud();
  }, [query, session, setNoti]);

  return (
    <Layout>
      <Title title="Detalles de la solicitud" />
      <Typography sx={{ mt: 5 }} variant="h6">
        Descarga de documentos
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            Formatos Administrativos
          </Typography>
          <List component="nav">
            <ListItem button onClick={() => GenerarFDA01(solicitudData)}>
              <ListItemText primary="FDA 01" />
            </ListItem>
            <ListItem button onClick={() => GenerarFDA02(solicitudData)}>
              <ListItemText primary="FDA 02" />
            </ListItem>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDA 03" />
              </ListItem>
            </Link>
            <ListItem button onClick={() => GenerarFDA04(solicitudData, plantelData)}>
              <ListItemText primary="FDA 04" />
            </ListItem>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDA 05" />
              </ListItem>
            </Link>
            <ListItem button onClick={() => GenerarFDA06(solicitudData)}>
              <ListItemText primary="FDA 06" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            Formatos Pedagógicos
          </Typography>
          <List component="nav">
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 01" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 02" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 03" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 04" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 05" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="FDP 06" />
              </ListItem>
            </Link>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            RVOE
          </Typography>
          <List component="nav">
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Acuerdo RVOE" />
              </ListItem>
            </Link>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            Evaluación
          </Typography>
          <List component="nav">
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Carta de Aceptación" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Carta de Asignación" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Carta de Imparcialidad y confidencialidad" />
              </ListItem>
            </Link>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            Inspección
          </Typography>
          <List component="nav">
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Orden de Inspección" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Acta de Inspección" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Acta de Cierre" />
              </ListItem>
            </Link>
          </List>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" color="textSecondary">
            Otros
          </Typography>
          <List component="nav">
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Oficio Admisorio" />
              </ListItem>
            </Link>
            <Link href="/destino-url">
              <ListItem button>
                <ListItemText primary="Desistimiento" />
              </ListItem>
            </Link>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
}
