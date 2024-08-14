import { Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { Button } from '@siiges-ui/shared';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import columns from './Mocks/AsignaturasFormacionElectiva';
import { TablesPlanEstudiosContext } from '../utils/Context/tablesPlanEstudiosProviderContext';
import AsignaturasFormacionCreateModal from '../utils/Components/AsignaturasFormacionModales/AsignaturasFormacionCreateModal';
import SolicitudContext from '../utils/Context/solicitudContext';
import useAsignaturas from '../utils/getAsignaturas';
import useSectionDisabled from './Hooks/useSectionDisabled';

export default function AsignaturasFormacionElectiva({ disabled, type }) {
  const { programaId } = useContext(SolicitudContext);
  const [modal, setModal] = useState(false);
  const showModal = () => setModal(true);
  const hideModal = () => setModal(false);
  const {
    asignaturasFormacionList,
    setAsignaturasFormacionList,
    setAsignaturasTotalList,
  } = useContext(TablesPlanEstudiosContext);

  const isSectionDisabled = useSectionDisabled(7);

  const isDisabled = disabled || isSectionDisabled;

  const { asignaturasFormacion, asignaturasTotal, loading } =
    type === 'editar'
      ? useAsignaturas(programaId)
      : { asignaturasFormacion: [], loading: false };

  const tableColumns = useMemo(
    () => columns(setAsignaturasFormacionList, asignaturasFormacionList),
    [setAsignaturasFormacionList, asignaturasFormacion]
  );

  useEffect(() => {
    if (type === 'editar' && !loading) {
      setAsignaturasFormacionList(asignaturasFormacion);
      setAsignaturasTotalList(asignaturasTotal);
    }
  }, [loading, asignaturasFormacion]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Asignaturas formación electiva</Typography>
      </Grid>
      <Grid item xs={3}>
        {!isDisabled && <Button onClick={showModal} text="agregar" />}
      </Grid>
      <Grid item xs={12}>
        <div style={{ height: 400, width: '100%', marginTop: 15 }}>
          <DataGrid
            rows={asignaturasFormacionList}
            columns={tableColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Grid>
      <AsignaturasFormacionCreateModal
        open={modal}
        hideModal={hideModal}
        type="crear"
        title="Agregar Asignatura Formación Electiva"
      />
    </Grid>
  );
}

AsignaturasFormacionElectiva.defaultProps = {
  type: null,
};

AsignaturasFormacionElectiva.propTypes = {
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.string,
};
