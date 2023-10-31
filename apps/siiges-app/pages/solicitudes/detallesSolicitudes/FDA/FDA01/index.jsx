import { jsPDF } from 'jspdf';

const img1 = 'https://i.postimg.cc/HsNJnDCb/img1.png';
const img2 = 'https://i.postimg.cc/FszdhFw9/img2.png';
const img3 = 'https://i.postimg.cc/c1Xtqt99/img3.png';

export default function GenerarFDA01(solicitud) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  let currentPositionY = 90;

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

  const fechaCreacion = solicitud.createdAt;

  // Convierte la cadena de texto en un objeto de fecha
  const fecha = new Date(fechaCreacion);

  // Obtiene el día, mes y año de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0, por lo que se suma 1
  const año = fecha.getFullYear();

  // Formatea la fecha en el formato "día/mes/año"
  const fechaFormateada = `${dia}/${mes}/${año}`;

  let tipoSolicitud = ''; // Esta variable almacenará el nombre de la solicitud.
  if (solicitud.tipoSolicitudId === 1) {
    tipoSolicitud = 'NUEVA SOLICITUD';
  } else if (solicitud.tipoSolicitudId === 2) {
    tipoSolicitud = 'REFRENDO';
  } else if (solicitud.tipoSolicitudId === 3) {
    tipoSolicitud = 'CAMBIO DE DOMICILIO';
  }

  let nombreNivel = '';
  if (solicitud.programa.nivelId === 1) {
    nombreNivel = 'Bachillerato';
  } else if (solicitud.programa.nivelId === 2) {
    nombreNivel = 'Licenciatura';
  } else if (solicitud.programa.nivelId === 3) {
    nombreNivel = 'Técnico Superior Universitario';
  } else if (solicitud.programa.nivelId === 4) {
    nombreNivel = 'Especialidad';
  } else if (solicitud.programa.nivelId === 5) {
    nombreNivel = 'Maestría';
  } else if (solicitud.programa.nivelId === 6) {
    nombreNivel = 'Doctorado';
  }

  let modalidadTipo = '';
  if (solicitud.programa.modalidadId === 1) {
    modalidadTipo = 'Escolarizada';
  } else if (solicitud.programa.modalidadId === 2) {
    modalidadTipo = 'No escolarizada';
  } else if (solicitud.programa.modalidadId === 3) {
    modalidadTipo = 'Mixta';
  } else if (solicitud.programa.modalidadId === 4) {
    modalidadTipo = 'Dual';
  }

  let ciclosTipo = '';
  if (solicitud.programa.modalidadId === 1) {
    ciclosTipo = 'Semestral';
  } else if (solicitud.programa.modalidadId === 2) {
    ciclosTipo = 'Cuatrimestral';
  } else if (solicitud.programa.modalidadId === 3) {
    ciclosTipo = 'Anual';
  } else if (solicitud.programa.modalidadId === 4) {
    ciclosTipo = 'Semestral curriculum flexible';
  } else if (solicitud.programa.modalidadId === 5) {
    ciclosTipo = 'Cuatrimestral curriculum flexible';
  }

  const { programaTurnos } = solicitud.programa;
  const tiposDeTurno = [];
  programaTurnos.forEach((turno) => {
    if (turno.turnoId === 1) {
      tiposDeTurno.push('Matutino');
    } else if (turno.turnoId === 2) {
      tiposDeTurno.push('Vespertino');
    } else if (turno.turnoId === 3) {
      tiposDeTurno.push('Nocturno');
    } else if (turno.turnoId === 4) {
      tiposDeTurno.push('Mixto');
    }
  });

  // Convierte el arreglo de tipos de turno en un texto separado por comas
  const turnoTipo = tiposDeTurno.join(', ');

  doc.addImage(img1, 'JPEG', 0, 15, 70, 19);
  doc.addImage(img2, 'JPEG', 145, 15, 50, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setFillColor(6, 98, 211);
  crearCelda(doc, 150, 40, 45, 7, 'FDA01');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(69, 133, 244);
  doc.text('OFICIO DE ENTREGA DE DOCUMENTACIÓN', 20, 50);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('SUBSECRETARÍA DE EDUCACIÓN SUPERIOR', 20, 60);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(
    'AT´N: DIRECTOR GENERAL DE INCORPORACIÓN Y SERVICIOS ESCOLARES.',
    40,
    69,
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(fechaFormateada, 152, 75);

  crearSeccion(
    doc,
    `Por este conducto manifiesto que estoy en condiciones para iniciar el trámite de SOLICITUD DE ${tipoSolicitud} del programa ${nombreNivel} en ${solicitud.programa.nombre}, modalidad ${modalidadTipo}, en periodos ${ciclosTipo}, turno ${turnoTipo}, de la Institución ${solicitud.programa.plantel.institucion.nombre}. Así mismo declaro Bajo Protesta de Decir la Verdad que la información y los documentos anexos en la presente solicitud son verídicos y fueron elaborados siguiendo principios éticos profesionales, que son de mi conocimiento las penas en que incurren quienes se conducen con falsedad ante autoridad distinta de la judicial, y señalo como domicilio para recibir notificaciones:`,
  );

  crearSeccion(
    doc,
    `Calle: ${solicitud.programa.plantel.domicilio.calle}
Número telefónico particular: ${solicitud.programa.plantel.telefono1}
Número telefónico celular: ${solicitud.programa.plantel.telefono2}`,
    'left', // Al cambiar esto a 'right', el contenido se alineará a la derecha
  );

  crearSeccion(
    doc,
    'Quedo enterado de todas las disposiciones establecidas en la Ley General de Educación, La Ley General de Educación Superior, de Educación del Estado Libre y Soberano de Jalisco, la Ley de Educación Superior del Estado de Jalisco, así como del para obtención de Reconocimiento de Validez Oficial de Estudios de Educación Superior del Estado de Jalisco.',
    'justify',
  );

  currentPositionY += 50;

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
    const pageNumberTextWidth = (doc.getStringUnitWidth(pageNumberText)
    * doc.internal.getFontSize())
      / doc.internal.scaleFactor;
    const pageNumberTextX = pageWidth - 20 - pageNumberTextWidth;
    const pageNumberTextY = pageHeight - 10;

    doc.text(pageNumberText, pageNumberTextX, pageNumberTextY);

    // Agregar imagen en el pie de página
    const imgBottomLeftX = 10; // Posición X de la imagen
    const imgBottomLeftY = pageHeight - 10; // Posición Y de la imagen
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
