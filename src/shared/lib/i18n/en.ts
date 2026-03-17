export const en = {
	// Common buttons
	common: {
		accept: "Accept",
		cancel: "Cancel",
		save: "Save",
		delete: "Delete",
		edit: "Edit",
		create: "Create",
		confirm: "Confirm",
		close: "Close",
		loading: "Loading...",
		update: "Update",
		next: "Next",
		logOut: "Log out",
		tryAgain: "Try again",
	},

	// Database Diagram
	databaseDiagram: {
		changingVersion: "Changing version...",
		newCollection: "New Collection",
		relationshipExists: "A relationship already exists between these tables",
	},

	// Modals
	modals: {
		createCollection: {
			title: "Create collection",
			nameLabel: "Name",
			creating: "Creating collection...",
		},
		error: {
			accept: "Accept",
		},
		addProject: {
			title: "New project",
			nameLabel: "Project Name:",
			creating: "Creating project...",
		},
		editProject: {
			title: "Edit project",
			nameLabel: "Project Name:",
			creating: "Creating project...",
		},
		deleteProject: {
			title: "Confirm delete project",
			confirmMessage: "Are you sure you want to delete",
			irreversibleAction: "This action cannot be undone.",
			deleting: "Deleting project...",
			defaultProjectName: "this project",
		},
		attributes: {
			addTitle: "Add Attributes",
			editTitle: "Edit Attributes",
			namePlaceholder: "Name",
		},
		document: {
			createTitle: "Create Document",
			nameLabel: "Name",
		},
		newQuery: {
			title: "New Query",
			queryLabel: "Query",
			queryPlaceholder: "Write your query",
			error: "You must write a query before continuing.",
		},
	},

	// API Errors
	apiErrors: {
		sessionExpired: "Session expired or invalid credentials",
		noPermission: "You don't have permission to perform this action",
		notFound: "Resource not found",
		alreadyExists: "Resource already exists",
		invalidData: "Invalid input data",
		tooManyRequests: "Too many requests. Please try again later",
		serverError: "Internal server error",
		networkError: "Network error. Please check your connection",
		unknownError: "An unknown error occurred",
	},

	// Toasts
	toasts: {
		canvasSaved: "Canvas saved successfully",
		errorSavingCanvas: "Error saving canvas",
	},

	// Error pages
	errors: {
		somethingWentWrong: "Something went wrong. Please try again.",
	},

	// Other
	other: {
		noImage: "No image",
		involvedCollections: "Involved Collections",
		lastEdited: "Last edited",
		yourProjects: "Your Projects",
		newModel: "New Model",
		newAttribute: "new attribute",
		addAttributes: "Add attributes",
		addDocuments: "Add documents",
	},

	// Header
	header: {
		newVersion: "Create new version",
	},
};

// Type for translation structure (allows different string values per locale)
export type TranslationKeys = {
	[K in keyof typeof en]: (typeof en)[K] extends object
		? {
				[P in keyof (typeof en)[K]]: (typeof en)[K][P] extends object
					? {
							[Q in keyof (typeof en)[K][P]]: string;
					  }
					: string;
		  }
		: string;
};
