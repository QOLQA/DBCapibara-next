export const es = {
	// Common buttons
	common: {
		accept: "Aceptar",
		cancel: "Cancelar",
		save: "Guardar",
		delete: "Eliminar",
		edit: "Editar",
		create: "Crear",
		confirm: "Confirmar",
		close: "Cerrar",
		loading: "Cargando...",
		update: "Actualizar",
		next: "Siguiente",
		logOut: "Cerrar sesión",
		tryAgain: "Intentar de nuevo",
	},

	// Database Diagram
	databaseDiagram: {
		changingVersion: "Cambiando versión...",
		newCollection: "Nueva Colección",
		relationshipExists: "Ya existe una relación entre estas tablas",
	},

	// Modals
	modals: {
		createCollection: {
			title: "Crear colección",
			nameLabel: "Nombre",
			creating: "Creando colección...",
		},
		error: {
			accept: "Aceptar",
		},
		addProject: {
			title: "Nuevo proyecto",
			nameLabel: "Nombre del proyecto:",
			creating: "Creando proyecto...",
		},
		editProject: {
			title: "Editar proyecto",
			nameLabel: "Nombre del proyecto:",
			updating: "Actualizando proyecto...",
		},
		deleteProject: {
			title: "Eliminar proyecto",
			description: "¿Estás seguro de que quieres eliminar este proyecto?",
			deleting: "Eliminando proyecto...",
		},
	},

	// Login
	login: {
		title: "¡Bienvenido de nuevo!",
		description:
			"Inicia sesión para continuar trabajando en tus modelos de base de datos.",
		emailLabel: "Correo electrónico",
		passwordLabel: "Contraseña",
		loginButton: "Iniciar sesión",
		registerPrompt: "¿No tienes una cuenta?",
		registerLink: "Regístrate aquí",
	},

	// Projects
	projects: {
		title: "Tus proyectos",
		newProjectButton: "Nuevo proyecto",
		lastModified: "Última modificación:",
	},

	// Other
	other: {
		involvedCollections: "Colecciones involucradas:",
	},

	errors: {
		somethingWentWrong:
			"Algo salió mal. Por favor, inténtalo de nuevo.",
	},
} as const;

