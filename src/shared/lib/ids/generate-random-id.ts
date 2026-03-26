const CHAR_SET =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRandomId = (): string => {
	let id = "";
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * CHAR_SET.length);
		id += CHAR_SET[randomIndex];
	}
	return id;
};
