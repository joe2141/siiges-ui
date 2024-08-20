import { ButtonStyled, Context } from '@siiges-ui/shared';
import React, { useContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { getInstitucionUsuario } from '@siiges-ui/instituciones';
import submitEditPlantel from '../utils/submitEditPlantel';
import submitNewSolicitud from '../utils/submitNewSolicitud';
import submitEditSolicitud from '../utils/submitEditSolicitud';
import SolicitudContext from '../utils/Context/solicitudContext';
import submitInstitucion from '../utils/submitInstitucion';
import DatosGeneralesContext from '../utils/Context/datosGeneralesContext';
import submitRepresentante from '../utils/submitRepresentante';
import PlantelContext from '../utils/Context/plantelContext';
import submitDescripcionPlantel from '../utils/submitDescripcionPlantel';
import submitHigienesPlantel from '../utils/submitHigienesPlantel';
import submitRatificacion from '../utils/submitRatificacion';
import { useEvaluacionCurricular } from '../utils/Context/evaluacionCurricularContext';
import { ObservacionesContext } from '../utils/Context/observacionesContext';
import submitEvaluacionCurricular from '../utils/submitEvaluacionCurricular';
import submitTrayectoriaEducativa from '../utils/submitTrayectoriaeducativa';

export default function ButtonSection({
  type,
  id,
  sections,
  position,
  next,
  prev,
  sectionTitle,
}) {
  const [newSubmit, setNewSubmit] = useState(true);
  const {
    setNoti, session, loading, setLoading,
  } = useContext(Context);
  const institucion = getInstitucionUsuario(session);
  const validations = useContext(SolicitudContext);
  const evaluacionCurricular = useEvaluacionCurricular();
  const plantelesValidations = useContext(PlantelContext);
  const datosGeneralesValidations = useContext(DatosGeneralesContext);
  const { setCreateObservaciones, setSections } = useContext(ObservacionesContext);
  const router = useRouter();
  let submit;

  const isControlDocumental = session.rol === 'control_documental';
  const buttonText = isControlDocumental
    ? 'Guardar observaciones'
    : 'Guardar  Sección';
  const buttonTextEnd = isControlDocumental
    ? 'Guardar observaciones'
    : 'Guardar  Sección';

  function observaciones() {
    return setCreateObservaciones(true);
  }

  function validateNewSolicitud() {
    if (newSubmit) {
      if (type !== 'editar') {
        submitNewSolicitud(validations, setNewSubmit, setLoading, setSections);
      } else {
        submitEditSolicitud(validations, sections, id, setLoading, setSections);
      }
    } else {
      submitEditSolicitud(validations, sections, id, setLoading, setSections);
    }
  }

  const sectionFunctions = {
    'Datos Generales': {
      1: useCallback(
        () => submitInstitucion(
          datosGeneralesValidations,
          sections,
          setNoti,
          setLoading,
        ),
        [datosGeneralesValidations, sections],
      ),
      2: useCallback(
        () => submitRepresentante(
          datosGeneralesValidations,
          sections,
          setNoti,
          setLoading,
        ),
        [datosGeneralesValidations, sections],
      ),
    },
    Plantel: {
      1: () => submitEditPlantel(
        plantelesValidations,
        sections,
        id,
        setNoti,
        router,
        setLoading,
      ),
      2: () => submitDescripcionPlantel(
        plantelesValidations,
        setNoti,
        setLoading,
        institucion.id,
      ),
      3: () => submitHigienesPlantel(plantelesValidations, setNoti, setLoading),
      6: () => submitRatificacion(plantelesValidations, setNoti, setLoading),
    },
    'Evaluación Curricular': {
      1: () => submitEvaluacionCurricular(evaluacionCurricular, setNoti, setLoading),
    },
    'Plan de estudios': {
      1: () => validateNewSolicitud(),
      3: () => submitEditSolicitud(validations, sections, id, setLoading, setSections),
      4: () => submitEditSolicitud(validations, sections, id, setLoading, setSections),
      5: () => submitEditSolicitud(validations, sections, id, setLoading, setSections),
      9: () => submitTrayectoriaEducativa(validations, setLoading),
    },
  };
  if (isControlDocumental) {
    submit = () => {
      observaciones();
    };
  }
  if (sectionFunctions[sectionTitle] && !isControlDocumental) {
    if (typeof sectionFunctions[sectionTitle] === 'function') {
      submit = () => {
        setLoading(true);
        sectionFunctions[sectionTitle]();
      };
    } else if (sectionFunctions[sectionTitle][sections]) {
      submit = () => {
        setLoading(true);
        sectionFunctions[sectionTitle][sections]();
      };
    }
  }

  return (
    <>
      {position === 'first' && (
        <Grid container spacing={1} sx={{ textAlign: 'right', mt: 0.5 }}>
          <Grid item xs={9}>
            <ButtonStyled
              text={buttonText}
              alt={buttonText}
              type="success"
              onclick={!loading ? submit : null}
            />
          </Grid>
          <Grid item xs={3}>
            <ButtonStyled
              text={<ArrowForwardIosIcon sx={{ height: 14 }} />}
              alt={<ArrowForwardIosIcon sx={{ height: 14 }} />}
              type="success"
              onclick={next}
            />
          </Grid>
        </Grid>
      )}
      {position === 'middle' && (
        <Grid container spacing={1} sx={{ textAlign: 'right', mt: 0.5 }}>
          <Grid item xs={3}>
            <ButtonStyled
              text={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
              alt={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
              type="success"
              onclick={prev}
            />
          </Grid>
          <Grid item xs={6}>
            <ButtonStyled
              text={buttonText}
              alt={buttonText}
              type="success"
              onclick={!loading ? submit : null}
            />
          </Grid>
          <Grid item xs={3}>
            <ButtonStyled
              text={<ArrowForwardIosIcon sx={{ height: 14 }} />}
              alt={<ArrowForwardIosIcon sx={{ height: 14 }} />}
              type="success"
              onclick={next}
            />
          </Grid>
        </Grid>
      )}
      {position === 'last' && (
        <Grid container spacing={1} sx={{ textAlign: 'right', mt: 0.5 }}>
          <Grid item xs={6}>
            <ButtonStyled
              text={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
              alt={<ArrowBackIosNewIcon sx={{ height: 14 }} />}
              type="success"
              onclick={prev}
            />
          </Grid>
          <Grid item xs={6}>
            <ButtonStyled
              text={buttonTextEnd}
              alt={buttonTextEnd}
              type="success"
              onclick={!loading ? submit : null}
            />
          </Grid>
        </Grid>
      )}
      {position === 'only' && (
        <Grid container spacing={1} sx={{ textAlign: 'right', mt: 0.5 }}>
          <Grid item xs={12}>
            <ButtonStyled
              text={buttonTextEnd}
              alt={buttonTextEnd}
              type="success"
              onclick={!loading ? submit : null}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

ButtonSection.defaultProps = {
  type: null,
  id: null,
};

ButtonSection.propTypes = {
  type: PropTypes.string,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
  sections: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sectionTitle: PropTypes.string.isRequired,
};
