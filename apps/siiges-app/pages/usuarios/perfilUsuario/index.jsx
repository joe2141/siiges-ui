import React, { useContext } from 'react';
import { Context, Layout, getCurrentUser } from '@siiges-ui/shared';
import { UsuarioAvatar, UsuarioView } from '@siiges-ui/users';
import Grid from '@mui/material/Grid';

export default function UserProfile() {
  const { session } = useContext(Context);
  const { user, loading } = getCurrentUser(session.id);
  return (
    <Layout title="Consultar Usuarios">
      {loading ? (
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ marginTop: 7 }}>
            <UsuarioAvatar user={user} />
          </Grid>
          <UsuarioView user={user} />
        </Grid>
      ) : (
        <div />
      )}
    </Layout>
  );
}
