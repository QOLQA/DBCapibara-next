import type { TranslationKeys } from "./en";

// Type assertion needed because Spanish translations have different string values
export const es: TranslationKeys = {
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
			creating: "Creando proyecto...",
		},
		deleteProject: {
			title: "Confirmar eliminación de proyecto",
			confirmMessage: "¿Estás seguro de que deseas eliminar",
			irreversibleAction: "Esta acción no se puede deshacer.",
			deleting: "Eliminando proyecto...",
			defaultProjectName: "este proyecto",
		},
		attributes: {
			addTitle: "Agregar Atributos",
			editTitle: "Editar Atributos",
			namePlaceholder: "Nombre",
		},
		document: {
			createTitle: "Crear Documento",
			nameLabel: "Nombre",
		},
		newQuery: {
			title: "Nueva Consulta",
			queryLabel: "Consulta",
			queryPlaceholder: "Escribe tu consulta",
			error: "Debes escribir una consulta antes de continuar.",
		},
	},

	// API Errors
	apiErrors: {
		sessionExpired: "Sesión expirada o credenciales inválidas",
		noPermission: "No tienes permisos para realizar esta acción",
		notFound: "Recurso no encontrado",
		alreadyExists: "El recurso ya existe",
		invalidData: "Datos de entrada inválidos",
		tooManyRequests: "Demasiadas solicitudes. Por favor, intenta más tarde",
		serverError: "Error interno del servidor",
		networkError: "Error de red. Por favor, verifica tu conexión",
		unknownError: "Ocurrió un error desconocido",
	},

	// Toasts
	toasts: {
		canvasSaved: "Canvas guardado exitosamente",
		errorSavingCanvas: "Error al guardar canvas",
	},

	// Error pages
	errors: {
		somethingWentWrong: "Algo salió mal. Por favor, intenta de nuevo.",
	},

	// Other
	other: {
		noImage: "Sin imagen",
		involvedCollections: "Colecciones involucradas",
		lastEdited: "Última edición",
		yourProjects: "Tus Proyectos",
		newModel: "Nuevo Modelo",
		newAttribute: "nuevo atributo",
		addAttributes: "Agregar atributos",
		addDocuments: "Agregar documentos",
	},
};
