import jsPDF from 'jspdf';
import 'jspdf-autotable';

const img1 = 'https://i.postimg.cc/HsNJnDCb/img1.png';
const img2 = 'https://i.postimg.cc/FszdhFw9/img2.png';
const img3 = 'https://i.postimg.cc/c1Xtqt99/img3.png';

export default function GenerarFDA02(solicitud) {
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

  const fechaCreacion = solicitud.createdAt;
  // Convierte la cadena de texto en un objeto de fecha
  const fecha = new Date(fechaCreacion);
  // Obtiene el día, mes y año de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses son indexados desde 0, por lo que se suma 1
  const año = fecha.getFullYear();
  // Formatea la fecha en el formato 'día/mes/año'
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
  crearCelda(doc, 150, 40, 45, 7, 'FDA06');

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
  doc.text(fechaFormateada, 152, 58);

  crearSeccion(
    doc,
    `La C. ADRIANA DE LOS REYES MORENO de declara, bajo protesta de decir verdad, que los
datos proporcionados en la solicitud ${solicitud.folio} cuenta con un inmueble con las condiciones
de seguridad, higiénicas necesarias para impartir el plan de estudios para el programa
${nombreNivel} EN ${solicitud.programa.nombre}, modalidad ${modalidadTipo}, en
periodos ${ciclosTipo}, asimismo ACEPTA cumplir y se compromete con las siguientes
obligaciones derivadas del otorgamiento del Reconocimiento de Validez Oficial de Estudios.`,
  );

  crearSeccion(
    doc,
    `1.- Cumplir con lo dispuesto en el artículo 3° de la Constitución Política de los Estados Unidos
Mexicanos, en la Ley General de Educación, la Ley General de Educación Superior, la Ley de
Educación del Estado Libre y Soberano de Jalisco, la Ley de Educación Superior del Estado de
Jalisco y demás disposiciones legales y administrativas que le sean aplicables.`,
  );

  crearSeccion(
    doc,
    `2.- Mencionar, en toda su documentación y publicidad que expida, la fecha y número del
acuerdo por el cual se otorgó el Reconocimiento de Validez Oficial de Estudios, así como la
autoridad que lo expidió y el periodo establecido.`,
  );

  crearSeccion(
    doc,
    `3.- Respetar los lineamientos descritos en el Acuerdo que establece las bases mínimas de
información para la comercialización de los servicios educativos que prestan los particulares.`,
  );

  crearSeccion(
    doc,
    `4.- Ceñirse a los planes y programas autorizados por la Autoridad Educativa y a los tiempos
aprobados para su aplicación.`,
  );

  crearSeccion(
    doc,
    `5.- Los planes y programas de estudio validados por la Autoridad Educativa, una vez que son
aprobados no podrán modificarse hasta su vencimiento, de lo contrario no tendrá validez
para cualquier trámite ante cualquier autoridad competente.`,
  );

  crearSeccion(
    doc,
    `6.- La Institución se compromete a mantener actualizados los planes y programas de estudio
de acuerdo a los avances de la materia y someterlos a refrendo al término del periodo
establecido por la Autoridad Educativa.`,
  );

  crearSeccion(
    doc,
    `7.- Reportar a la Autoridad Educativa, cualquier daño o modificación que sufra el inmueble en
su estructura, con posterioridad a la fecha de presentación de la solicitud de autorización del
Reconocimiento de Validez Oficial de Estudios, proporcionando, en su caso, los datos de la
nueva constancia en la que se acredite que las reparaciones o modificaciones cumplen con
las normas mínimas de construcción y seguridad.`,
  );

  crearSeccion(
    doc,
    `8.- Facilitar y colaborar en las actividades de evaluación, inspección y vigilancia que las
autoridades competentes realicen u ordenen.`,
  );

  crearSeccion(
    doc,
    `9.- Conservar de manera física en el domicilio en el que se autorizó el RVOE, todos los
documentos administrativos y de control escolar que se generen, de conformidad a la Ley
General de Educación en su artículo 151.`,
  );

  crearSeccion(
    doc,
    `10.- Mantener vigente la Posesión Legal del Inmueble, el Dictamen de Seguridad Estructural,
Licencia de Uso de Suelo, Dictamen de Protección Civil y Licencia Municipal.`,
  );

  crearSeccion(
    doc,
    `11.- Constituir el Comité de Seguridad Escolar, de conformidad con los lineamientos
establecidos en el Diario Oficial de la Federación del 4 de septiembre de 1986.`,
  );

  crearSeccion(
    doc,
    `12.- La SICyT verificará las instalaciones para que cumplan con la normatividad vigente,
higiene seguridad y pedagogía.`,
  );

  crearSeccion(
    doc,
    `13.- Cumplir con el perfil de personal docente, tanto de nuevo ingreso como los propuestos a
una asignatura diferente. Cualquier modificación deberá presentarse a la autoridad
educativa para su autorización.`,
  );

  crearSeccion(
    doc,
    `14.- Contar con el acervo bibliográfico y los recursos didácticos requeridos para el desarrollo
del plan de estudios y sus respectivos programas.`,
  );

  crearSeccion(
    doc,
    `15.- Proporcionar un mínimo de becas del 5% del total de población estudiantil, establecidas
en la Ley y los lineamientos en la materia. Generar documentación que lo acredite y tenerla
en físico dado a que la SICyT puede solicitarla en alguna visita de vigilancia`,
  );

  crearSeccion(
    doc,
    `16.- Pagar anualmente la matrícula de alumnos por cada RVOE otorgado y alumno activo en
cada ejercicio escolar, acatando los requisitos y tiempos establecidos en la convocatoria
correspondiente.`,
  );

  crearSeccion(
    doc,
    `17.- Dar el seguimiento académico y reportar a la Dirección de Servicios Escolares los avances
académicos de los alumnos a partir de su inscripción, acreditación, regularización,
reinscripción, certificación y titulación.`,
  );

  crearSeccion(
    doc,
    `18.- Una vez recibido el Acuerdo de Incorporación, el particular deberá realizar los registros
ante las autoridades correspondientes, los trámites para la asignación de la clave de centro
de trabajo ante la Secretaría de Educación Jalisco, su registro ante la Dirección de
Profesiones del Estado de Jalisco y la Dirección General de Profesiones de la Secretaría de
Educación Pública y aquellos que correspondan.`,
  );

  crearSeccion(
    doc,
    `19.- Es obligación de la Institución Educativa, que la documentación que presenta sea
auténtica.`,
  );

  crearSeccion(
    doc,
    `20.- Emitir sus propios reglamentos internos, solicitar la autorización a la Secretaría de
Innovación Ciencia y Tecnología; una vez autorizados, los dará a conocer antes del trámite de
inscripción o reinscripción. Deberá conservar evidencia a fin de que la autoridad educativa
verifique el cumplimiento de esta obligación.`,
  );

  currentPositionY += 50;

  crearSeccion(
    doc,
    `                                                   BAJO PROTESTA DE DECIR VERDAD
                                                      GUILLERMO GÓNGORA CHALITA`,
    'left',
  );

  currentPositionY += 5;

  crearSeccion(
    doc,
    `                              ${solicitud.programa.plantel.domicilio.calle}, ${solicitud.programa.plantel.domicilio.numeroExterior} ${solicitud.programa.plantel.domicilio.numeroInterior}, ${solicitud.programa.plantel.domicilio.municipio.nombre} , ${solicitud.programa.plantel.domicilio.codigoPostal} , ${solicitud.programa.plantel.domicilio.estado.nombre}, MÉXICO ACUERDO NO. ${solicitud.programa.acuerdoRvoe}`,
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
