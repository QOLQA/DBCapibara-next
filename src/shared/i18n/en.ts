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
			updating: "Updating project...",
		},
		deleteProject: {
			title: "Delete project",
			description: "Are you sure you want to delete this project?",
			deleting: "Deleting project...",
		},
	},

	// Login
	login: {
		title: "Welcome back!",
		description: "Log in to continue working on your database models.",
		emailLabel: "Email",
		passwordLabel: "Password",
		loginButton: "Log in",
		registerPrompt: "Don't have an account?",
		registerLink: "Register here",
	},

	// Projects
	projects: {
		title: "Your projects",
		newProjectButton: "New project",
		lastModified: "Last modified:",
	},

	// Other
	other: {
		involvedCollections: "Involved collections:",
	},

	errors: {
		somethingWentWrong: "Something went wrong. Please try again.",
	},
} as const;

export type TranslationKeys = typeof en;

