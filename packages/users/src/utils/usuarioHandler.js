import Ajv from 'ajv';
import { createUsuarioSchema } from '../schemas/createUsuario.schema';
import { updateUsuarioSchema } from '../schemas/updateUsuario.schema';

const ENDPOINT_MAP = {
  representante: (id) => `/api/v1/usuarios/${id}/usuario`,
  admin: () => '/api/v1/usuarios',
};

const DATA_MAPPING = {
  crear: (form, { rol, id }) => ({
    endpoint: ENDPOINT_MAP[rol](id),
    method: 'POST',
    schema: createUsuarioSchema,
  }),
  editar: (form) => ({
    endpoint: `/api/v1/usuarios/${form.id}`,
    method: 'PATCH',
    schema: updateUsuarioSchema,
  }),
};

const setErrorState = (name, errorMessage, setError) => {
  setError((prevError) => ({ ...prevError, [name]: errorMessage }));
};

const errors = {
  nombre: (form, setError) => setErrorState(
    'nombre',
    !form.persona.nombre
      ? 'Nombre inválido'
      : '',
    setError,
  ),
  apellidoPaterno: (form, setError) => setErrorState(
    'apellidoPaterno',
    !form.persona.apellidoPaterno
      ? 'Apellido paterno inválido'
      : '',
    setError,
  ),
  apellidoMaterno: (form, setError) => setErrorState(
    'apellidoMaterno',
    !form.persona.apellidoMaterno
      ? 'Apellido materno inválido'
      : '',
    setError,
  ),
  rolId: (form, setError) => {
    setErrorState(
      'rolId',
      !form.rolId
        ? 'Rol inválido'
        : '',
      setError,
    );
  },
  tituloCargo: (form, setError) => setErrorState(
    'tituloCargo',
    !form.persona.tituloCargo
      ? 'Cargo inválido'
      : '',
    setError,
  ),
  correo: (form, setError) => setErrorState(
    'correo',
    !form.correo
      ? 'Correo inválido'
      : '',
    setError,
  ),
  usuario: (form, setError) => setErrorState(
    'usuario',
    !form.usuario
      ? 'Usuario inválido'
      : '',
    setError,
  ),
  contrasena: (form, setError) => {
    const { contrasena } = form;
    let errorMessage = '';

    if (!contrasena) {
      errorMessage = 'Contraseña inválida';
    } else if (contrasena.length < 4) {
      errorMessage = 'La contraseña debe contener al menos 4 caracteres';
    }
    setErrorState('contrasena', errorMessage, setError);
  },
  repeatContrasena: (form, setError) => setErrorState(
    'repeatContrasena',
    form.repeatContrasena !== form.contrasena
      ? 'Las contraseñas deben ser iguales'
      : '',
    setError,
  ),
};

const handleOnBlur = (e, { form, setError, isRequired }) => {
  const { name, required } = e.target;
  if (required || isRequired) {
    errors[name](form, setError);
  }
};

const handleOnChange = (e, { setForm }) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    ...(name === 'nombre'
      || name === 'apellidoPaterno'
      || name === 'apellidoMaterno'
      || name === 'tituloCargo'
      ? { persona: { ...prevForm.persona, [name]: value } }
      : { [name]: value }),
  }));
};

const handleRolOptions = (setRolOptions, session, useEffect) => {
  useEffect(() => {
    if (session.rol === 'representante') {
      setRolOptions([
        {
          id: '',
          nombre: '',
        },
        {
          id: '4',
          nombre: 'Gestor',
        },
        {
          id: '12',
          nombre: 'Control escolar IES',
        },
      ]);
    }

    if (session.rol === 'admin') {
      setRolOptions([
        {
          id: '',
          nombre: '',
        },
        {
          id: '2',
          nombre: 'Administrador',
        },
        {
          id: '3',
          nombre: 'Representante Legal',
        },
        {
          id: '5',
          nombre: 'Evaluador',
        },
        {
          id: '6',
          nombre: 'Inspector',
        },
        {
          id: '7',
          nombre: 'Revisión de documentos',
        },
        {
          id: '8',
          nombre: 'Sicyt de consulta',
        },
        {
          id: '9',
          nombre: 'Sicyt de editar',
        },
        {
          id: '10',
          nombre: 'Comite de evaluación',
        },
        {
          id: '11',
          nombre: 'Jefe de inspectores',
        },
        {
          id: '13',
          nombre: 'Control escolar SICYT',
        },
        {
          id: '14',
          nombre: 'Equivalencia SICYT',
        },
      ]);
    }
  }, []);
};

const createUsuario = ({
  accion, form, session, setEndpoint, setMethod, setReload, reload, setSchema, setNoti,
}) => {
  const { endpoint, method, schema } = DATA_MAPPING[accion](form, session);
  if (schema) {
    const ajv = new Ajv({ allErrors: true });

    const validate = ajv.compile(schema);

    const valid = validate(form);

    if (!valid) {
      setNoti({
        open: true,
        message: 'Revisa que los campos requeridos hayan sido llenados correctamente',
        type: 'error',
      });

      return false;
    }
  }

  setReload(!reload);
  setMethod(method);
  setEndpoint(endpoint);
  setSchema(schema);

  return true;
};

export {
  handleOnBlur,
  handleOnChange,
  handleRolOptions,
  createUsuario,
  errors,
};
