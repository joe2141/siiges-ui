import { getToken } from '@siiges-ui/shared';

export default async function getSolicitudDetalles(id, session, setNoti) {
  const apikey = process.env.NEXT_PUBLIC_API_KEY;
  const url = process.env.NEXT_PUBLIC_URL;
  const token = getToken();

  // Ensure all required parameters are available.
  if (!session || id === undefined) {
    setNoti({
      open: true,
      message: 'Session or ID not provided.',
      type: 'error',
    });
    throw new Error('Session or ID not provided.');
  }

  try {
    // Fetch details for the solicitud.
    const response = await fetch(`${url}/api/v1/solicitudes/${id}/detalles`, {
      method: 'GET',
      headers: {
        api_key: apikey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setNoti({
        open: true,
        message: 'Algo salió mal al cargar la información de la solicitud',
        type: 'error',
      });
      throw new Error('Failed to fetch data from solicitud');
    }

    const dataSolicitud = await response.json();

    // Assuming the ID for instituciones and planteles should be dynamic.
    // Modify this if they are supposed to be hardcoded.
    // const { institucionId, plantelId } = dataSolicitud;
    // Fetch details for the plantel.
    const responsePlanteles = await fetch(
      `${url}/api/v1/instituciones/1/planteles/2/detalles`,
      {
        method: 'GET',
        headers: {
          api_key: apikey,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!responsePlanteles.ok) {
      setNoti({
        open: true,
        message: 'Algo salió mal al cargar la información del plantel',
        type: 'error',
      });
      throw new Error('Failed to fetch data from plantel');
    }

    const dataPlantel = await responsePlanteles.json();

    return {
      solicitud: dataSolicitud.data,
      plantel: dataPlantel.data,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
