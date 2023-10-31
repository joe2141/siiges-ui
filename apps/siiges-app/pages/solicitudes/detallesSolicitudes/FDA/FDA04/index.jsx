import jsPDF from 'jspdf';
import 'jspdf-autotable';

const img1 = 'https://i.postimg.cc/HsNJnDCb/img1.png';
const img2 = 'https://i.postimg.cc/FszdhFw9/img2.png';
const img3 = 'https://i.postimg.cc/c1Xtqt99/img3.png';

export default function GenerarFDA04(solicitud, plantel) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  let currentPositionY = 67;

  // eslint-disable-next-line no-shadow
  function crearCelda(doc, x, y, width, height, texto) {
    doc.rect(x, y, width, height, 'F');
    doc.rect(x, y, width, height, 'S');

    doc.setFont('helvetica');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const textoWidth = (doc.getStringUnitWidth(texto) * doc.internal.getFontSize())
    / doc.internal.scaleFactor;
    const textoX = x + (width - textoWidth) / 2; // Calcula la posición X centrada

    doc.text(texto, textoX, y + 5); // Usar la posición X centrada
  }

  // eslint-disable-next-line no-shadow
  function crearSeccion(doc, contenido, alineacion = 'justify') {
    const margenIzquierdo = 20;

    // Contenido de la sección
    doc.setFont('helvetica');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const textHeight = doc.getTextDimensions(contenido, { maxWidth: 175 }).h;

    if (currentPositionY + textHeight > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentPositionY = 20; // Reiniciar la posición vertical en la nueva página
    }

    // Calcular la posición X según la alineación
    const textX = alineacion === 'right'
      ? doc.internal.pageSize.width - margenIzquierdo
      : margenIzquierdo;

    doc.text(textX, currentPositionY, contenido, {
      maxWidth: 175,
      align: alineacion,
    });

    currentPositionY += textHeight + 5; // Espacio después de cada sección
  }

  // eslint-disable-next-line no-shadow
  function crearSeccionConTabla1(doc, titulo, tablaData, tableOptions = {}) {
    const pageHeight = doc.internal.pageSize.height;
    const margin = 5;
    const availableSpace = pageHeight - margin;
    const textHeight = doc.getTextDimensions(titulo, {
      align: 'justify',
      maxWidth: 175,
    }).h;

    if (currentPositionY + textHeight + 20 > availableSpace) {
      doc.addPage();
      currentPositionY = margin; // Reiniciar la posición vertical en la nueva página
    }

    // Título de la sección
    doc.setFillColor(172, 178, 183);
    crearCelda(
      doc,
      14, // cellX
      currentPositionY, // cellY
      182, // cellWidth
      7, // cellHeight
      titulo,
    );

    const startY = currentPositionY + (tableOptions.spaceBeforeTable || 5);

    const previousY = currentPositionY; // Guardar la posición antes de crear la tabla

    doc.autoTable({
      startY,
      head: [tablaData.headers], // Encabezados de la tabla
      body: tablaData.body, // Datos de la tabla
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [172, 178, 183],
        fontSize: 12,
        textColor: [20, 20, 20],
      },
      ...tableOptions, // Opciones adicionales de la tabla
    });

    const tableHeight = currentPositionY - previousY; // Altura real de la tabla

    currentPositionY += tableHeight + 20; // Espacio después de la tabla
  }

  function generateTable(
    // eslint-disable-next-line no-shadow
    doc,
    headers,
    tableData,
    startY,
    headStyles,
    showHead,
  ) {
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY,
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      headStyles,
      showHead,
    });
  }

  const fechaCreacion = solicitud.createdAt;
  // Convierte la cadena de texto en un objeto de fecha
  const fecha = new Date(fechaCreacion);
  // Obtiene el día, mes y año de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0, por lo que se suma 1
  const año = fecha.getFullYear();
  // Formatea la fecha en el formato "día/mes/año"
  const fechaFormateada = `${dia}/${mes}/${año}`;

  let tipoSolicitud = '';
  switch (solicitud.tipoSolicitudId) {
    case 1:
      tipoSolicitud = 'NUEVA SOLICITUD';
      break;
    case 2:
      tipoSolicitud = 'REFRENDO';
      break;
    case 3:
      tipoSolicitud = 'CAMBIO DE DOMICILIO';
      break;
    default:
      // eslint-disable-next-line no-unused-vars
      tipoSolicitud = ''; // or some default value
  }

  let nombreNivel = '';
  switch (solicitud.programa.nivelId) {
    case 1:
      nombreNivel = 'Bachillerato';
      break;
    case 2:
      nombreNivel = 'Licenciatura';
      break;
    case 3:
      nombreNivel = 'Técnico Superior Universitario';
      break;
    case 4:
      nombreNivel = 'Especialidad';
      break;
    case 5:
      nombreNivel = 'Maestría';
      break;
    case 6:
      nombreNivel = 'Doctorado';
      break;
    default:
      nombreNivel = ''; // or some default value
  }

  let modalidadTipo = '';
  switch (solicitud.programa.modalidadId) {
    case 1:
      modalidadTipo = 'Escolarizada';
      break;
    case 2:
      modalidadTipo = 'No escolarizada';
      break;
    case 3:
      modalidadTipo = 'Mixta';
      break;
    case 4:
      modalidadTipo = 'Dual';
      break;
    default:
      modalidadTipo = ''; // or some default value
  }

  let ciclosTipo = '';
  switch (solicitud.programa.modalidadId) {
    case 1:
      ciclosTipo = 'Semestral';
      break;
    case 2:
      ciclosTipo = 'Cuatrimestral';
      break;
    case 3:
      ciclosTipo = 'Anual';
      break;
    case 4:
      ciclosTipo = 'Semestral curriculum flexible';
      break;
    case 5:
      ciclosTipo = 'Cuatrimestral curriculum flexible';
      break;
    default:
      // eslint-disable-next-line no-unused-vars
      ciclosTipo = ''; // or some default value
  }

  const { programaTurnos } = solicitud.programa;
  const tiposDeTurno = [];
  programaTurnos.forEach((turno) => {
    switch (turno.turnoId) {
      case 1:
        tiposDeTurno.push('Matutino');
        break;
      case 2:
        tiposDeTurno.push('Vespertino');
        break;
      case 3:
        tiposDeTurno.push('Nocturno');
        break;
      case 4:
        tiposDeTurno.push('Mixto');
        break;
      default:
    }
  });

  doc.addImage(img1, 'JPEG', 0, 15, 70, 19);
  doc.addImage(img2, 'JPEG', 145, 15, 50, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setFillColor(6, 98, 211);
  crearCelda(doc, 150, 40, 45, 7, 'FDA04');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(69, 133, 244);
  doc.text('DESCRIPCIÓN DE LAS INSTALACIONES', 20, 50);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(fechaFormateada, 152, 58);

  const tablaData1 = {
    headers: ['Nombre', 'datos'],
    body: [
      [
        'NIVEL Y NOMBRE DEL PLAN DE ESTUDIOS',
        `${nombreNivel}   ${solicitud.programa.nombre}`,
      ],
      ['MODALIDAD', modalidadTipo],
      ['DURACIÓN DEL PROGRAMA', solicitud.programa.duracionPeriodos],
      [
        'NOMBRE COMPLETO DE LA PERSONA FÍSICA O JURIDICA',
        'ADRIANA DE LOS REYES MORENO',
      ],
    ],
    showHead: false,
    columnStyles: {
      0: {
        fillColor: [172, 178, 183],
      },
      1: {
        fontStyle: 'bold',
      },
    },
  };

  crearSeccionConTabla1(doc, '1. DATOS DEL PLAN DE ESTUDIOS', tablaData1, {
    spaceBeforeTable: 7,
    ...tablaData1, // Pasa los estilos de la tabla como parte de las opciones
  });

  currentPositionY = doc.previousAutoTable.finalY + 5;

  const tablaData2 = {
    headers: ['CALLE Y NÚMERO', 'COLONIA'],
    body: [
      [
        `${solicitud.programa.plantel.domicilio.calle
        }  ${
          solicitud.programa.plantel.domicilio.numeroExterior}`,
        solicitud.programa.plantel.domicilio.colonia,
      ],
    ],
  };

  crearSeccionConTabla1(doc, '2. DOMICILIO DE LA INSTITUCIÓN', tablaData2, {
    spaceBeforeTable: 7,
  });

  currentPositionY = doc.previousAutoTable.finalY - 20;

  const headers2 = [
    'CÓDIGO POSTAL',
    'DELEGACIÓN O MUNICIPIO',
    'ENTIDAD FEDERATIVA',
  ];
  const tableData2 = [
    [
      solicitud.programa.plantel.domicilio.codigoPostal,
      solicitud.programa.plantel.domicilio.municipio.nombre,
      solicitud.programa.plantel.domicilio.estado.nombre,
    ],
  ];
  generateTable(doc, headers2, tableData2, currentPositionY + 20, {
    fillColor: [172, 178, 183],
    fontSize: 12,
    textColor: [20, 20, 20],
  });

  currentPositionY = doc.previousAutoTable.finalY - 20;

  const headers3 = [
    'NÚMERO TELEFÓNICO',
    'REDES SOCIALES',
    'CORREO ELECTRÓNICO',
  ];
  const tableData3 = [
    [
      `${solicitud.programa.plantel.telefono1},\n${solicitud.programa.plantel.telefono2},\n${solicitud.programa.plantel.telefono3}`,
      solicitud.programa.plantel.institucion.redesSociales,
      `${solicitud.programa.plantel.correo1},\n${solicitud.programa.plantel.correo2},\n${solicitud.programa.plantel.correo3}`,
    ],
  ];
  generateTable(doc, headers3, tableData3, currentPositionY + 20, {
    fillColor: [172, 178, 183],
    fontSize: 12,
    textColor: [20, 20, 20],
  });

  currentPositionY = doc.previousAutoTable.finalY + 10;

  const tablaData4 = {
    headers: ['CARACTERISTICAS DEL INMUEBLE', 'EDIFICIOS Y/O NIVELES'],
    body: [
      [`${plantel.tipoInmueble.nombre}, ${plantel.plantelEdificioNiveles}`],
      ['', 'SEGUNDO PISO'],
    ],
  };

  crearSeccionConTabla1(doc, '3. DESCRIPCIÓN DEL PLANTEL', tablaData4, {
    spaceBeforeTable: 7,
  });

  currentPositionY = doc.previousAutoTable.finalY + 10;

  const tablaData5 = {
    headers: ['DESCRIPCIÓN', 'CANTIDAD'],
    body: [
      ['RECUBRIMIENTOS PLÁSTICOS EN PISOS Y ESCALONES', '1'],
      ['ALARMA CONTRA INCENDIOS Y/O TERREMOTOS', '2'],
      ['SEÑALAMIENTOS DE EVACUACIÓN', '51'],
      ['BOTIQUÍN', '3'],
      ['ESCALERAS DE EMERGENCIA', '3'],
      ['ÁREA DE SEGURIDAD', '4'],
      ['EXTINTORES', '14'],
      ['PUNTOS DE REUNIÓN PARA EVACUACIÓN', '2'],
    ],
  };

  crearSeccionConTabla1(doc, 'SISTEMA DE SEGURIDAD', tablaData5, {
    spaceBeforeTable: 7,
  });

  currentPositionY = doc.previousAutoTable.finalY + 10;

  const tablaData6 = {
    headers: ['DESCRIPCIÓN', 'CANTIDAD'],
    body: [
      ['SANITARIOS EXCLUSIVOS PARA EL ALUMNADO VARÓN', '0'],
      ['SANITARIOS EXCLUSIVOS PARA EL ALUMNADO FEMENINO', '2'],
      ['SANITARIOS EXCLUSIVOS PARA EL PERSONAL MASCULINO ADMINISTRATIVO', '1'],
      ['SANITARIOS EXCLUSIVOS PARA EL PERSONAL FEMENINO ADMINISTRATIVO', '1'],
      ['PERSONAS ENCARGADAS DE LA LIMPIEZA', '2'],
      ['CESTOS DE BASURA', '23'],
      ['NÚMERO DE AULAS EN EL PLANTEL', '4'],
      ['BUTACAS POR AULA', '14'],
      ['VENTANAS QUE PUEDEN ABRIRSE POR AULA', '2'],
      ['NÚMERO DE VENTILADORES EN TODO EL PLANTEL', '1'],
      ['NÚMERO DE AIRES ACONDICIONADOS EN TODO EL PLANTEL', '0'],
    ],
  };

  crearSeccionConTabla1(doc, '4. HIGIENE DEL PLANTEL', tablaData6, {
    spaceBeforeTable: 7,
  });

  currentPositionY = doc.previousAutoTable.finalY + 10;

  const tablaData7 = {
    headers: ['DESCRIPCIÓN', 'CANTIDAD'],
    body: [
      ['SANITARIOS EXCLUSIVOS PARA EL ALUMNADO VARÓN', '0'],
      ['SANITARIOS EXCLUSIVOS PARA EL ALUMNADO FEMENINO', '2'],
      ['SANITARIOS EXCLUSIVOS PARA EL PERSONAL MASCULINO ADMINISTRATIVO', '1'],
      ['SANITARIOS EXCLUSIVOS PARA EL PERSONAL FEMENINO ADMINISTRATIVO', '1'],
      ['PERSONAS ENCARGADAS DE LA LIMPIEZA', '2'],
      ['CESTOS DE BASURA', '23'],
      ['NÚMERO DE AULAS EN EL PLANTEL', '4'],
      ['BUTACAS POR AULA', '14'],
      ['VENTANAS QUE PUEDEN ABRIRSE POR AULA', '2'],
      ['NÚMERO DE VENTILADORES EN TODO EL PLANTEL', '1'],
      ['NÚMERO DE AIRES ACONDICIONADOS EN TODO EL PLANTEL', '0'],
    ],
  };

  crearSeccionConTabla1(
    doc,
    '6.  RELACIÓN DE INSTITUCIONES DE SALUD ALEDAÑAS U OTROS SERVICIOS DE EMERGENCIA',
    tablaData7,
    { spaceBeforeTable: 7 },
  );

  currentPositionY = doc.previousAutoTable.finalY + 10;

  currentPositionY += 30;

  crearSeccion(
    doc,
    `                                                   BAJO PROTESTA DE DECIR VERDAD
                                                      GUILLERMO GÓNGORA CHALITA`,
    'left',
  );

  const totalPages = doc.internal.getNumberOfPages();
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const pageNumberText = `Página ${i} de ${totalPages}`;
    const pageNumberTextWidth = (
      doc.getStringUnitWidth(pageNumberText) * doc.internal.getFontSize()
    )
      / doc.internal.scaleFactor;
    const pageNumberTextX = pageWidth - 20 - pageNumberTextWidth;
    const pageNumberTextY = pageHeight - 10;

    doc.text(pageNumberText, pageNumberTextX, pageNumberTextY);

    // Agregar imagen en el pie de página
    const imgBottomLeftX = 3; // Posición X de la imagen
    const imgBottomLeftY = pageHeight - 3; // Posición Y de la imagen
    const imgBottomLeftWidth = 18; // Ancho de la imagen
    const imgBottomLeftHeight = 18; // Alto de la imagen

    doc.addImage(
      img3,
      'JPEG',
      imgBottomLeftX,
      imgBottomLeftY - imgBottomLeftHeight,
      imgBottomLeftWidth,
      imgBottomLeftHeight,
    );

    const pdfDataUri = doc.output('dataurlnewwindow');

    // Abrir el PDF en una nueva pestaña
    window.open(pdfDataUri, '_blank');
  }
}
