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
			creating: "Actualizando proyecto...",
			updating: "Actualizando proyecto...",
		},
		deleteProject: {
			title: "Eliminar proyecto",
			description: "¿Estás seguro de que quieres eliminar este proyecto?",
			confirmMessage: "¿Estás seguro de que deseas eliminar",
			irreversibleAction: "Esta acción es irreversible.",
			defaultProjectName: "este proyecto",
			deleting: "Eliminando proyecto...",
		},
		newQuery: {
			title: "Nueva consulta",
			queryLabel: "Consulta:",
			queryPlaceholder: "Escribe tu consulta aquí...",
			error: "La consulta no puede estar vacía.",
		},
		document: {
			createTitle: "Crear documento",
			nameLabel: "Nombre",
		},
		attributes: {
			addTitle: "Agregar atributo",
			editTitle: "Editar atributo",
			namePlaceholder: "Nombre del atributo",
		},
	},

	// Login
	login: {
		title: "¡Bienvenido de nuevo!",
		description:
			"Inicia sesión para continuar trabajando en tus proyectos de base de datos.",
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
		newProject: "Nuevo proyecto",
		yourProjects: "Tus proyectos",
		lastEdited: "Última edición:",
		noImage: "Sin imagen",
		newAttribute: "Nuevo atributo",
		addAttributes: "Agregar atributos",
		addDocuments: "Agregar documentos",
	},

	// Header
	header: {
		duplicateVersion: "Duplicar versión",
	},

	// Toasts
	toasts: {
		canvasSaved: "Canvas guardado correctamente.",
		errorSavingCanvas: "Error al guardar el canvas.",
		versionDuplicated: "Versión duplicada correctamente.",
		errorDuplicatingVersion: "Error al duplicar la versión.",
	},

	errors: {
		somethingWentWrong:
			"Algo salió mal. Por favor, inténtalo de nuevo.",
	},
} as const;

