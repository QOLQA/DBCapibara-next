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
			creating: "Updating project...",
			updating: "Updating project...",
		},
		deleteProject: {
			title: "Delete project",
			description: "Are you sure you want to delete this project?",
			confirmMessage: "Are you sure you want to delete",
			irreversibleAction: "This action is irreversible.",
			defaultProjectName: "this project",
			deleting: "Deleting project...",
		},
		deleteVersion: {
			title: "Delete version",
			confirmMessage: "Are you sure you want to delete",
			irreversibleAction: "This action is irreversible.",
			defaultVersionName: "this version",
			deleting: "Deleting version...",
			cannotDeleteLast: "Cannot delete the only version.",
		},
		newQuery: {
			title: "New query",
			queryLabel: "Query:",
			queryPlaceholder: "Write your query here...",
			error: "The query cannot be empty.",
		},
		document: {
			createTitle: "Create document",
			nameLabel: "Name",
		},
		attributes: {
			addTitle: "Add attribute",
			editTitle: "Edit attribute",
			namePlaceholder: "Attribute name",
		},
	},

	// Login
	login: {
		title: "Welcome back!",
		description: "Log in to continue working on your database projects.",
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
		newProject: "New project",
		yourProjects: "Your projects",
		lastEdited: "Last edited:",
		noImage: "No image",
		newAttribute: "New attribute",
		addAttributes: "Add attributes",
		addDocuments: "Add documents",
	},

	// Header
	header: {
		duplicateVersion: "Duplicate version",
		addNewVersion: "Add new version",
		editVersionName: "Edit version name",
	},

	// Toasts
	toasts: {
		canvasSaved: "Canvas saved successfully.",
		errorSavingCanvas: "Error saving canvas.",
		versionDuplicated: "Version duplicated successfully.",
		errorDuplicatingVersion: "Error duplicating version.",
		versionDeleted: "Version deleted successfully.",
		errorDeletingVersion: "Error deleting version.",
		versionCreated: "New version created successfully.",
		errorCreatingVersion: "Error creating version.",
		versionRenamed: "Version name updated successfully.",
		errorRenamingVersion: "Error updating version name.",
		versionNameEmpty: "Version name cannot be empty.",
		versionNameTooLong: "Version name is too long (max 500 characters).",
	},

	errors: {
		somethingWentWrong: "Something went wrong. Please try again.",
	},
} as const;

export type TranslationKeys = typeof en;

