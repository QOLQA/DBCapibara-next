const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL || "";
const CLOUDINARY_API_SECRET =
	process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "";
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";

// Debug: mostrar qué variables están disponibles (solo en desarrollo)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	console.log("Cloudinary Config Check:", {
		hasUrl: !!CLOUDINARY_URL,
		hasApiKey: !!CLOUDINARY_API_KEY,
		hasApiSecret: !!CLOUDINARY_API_SECRET,
		url: CLOUDINARY_URL ? `${CLOUDINARY_URL.substring(0, 30)}...` : "missing",
	});
}

const generateSignature = async (
	publicId: string,
	timestamp: string
): Promise<string> => {
	// Create the string to hash
	const paramsToSign: Record<string, string> = {
		public_id: publicId,
		timestamp: timestamp,
		overwrite: "true",
	};

	// Sort parameters alphabetically
	const sortedParams = Object.keys(paramsToSign)
		.sort()
		.map((key) => `${key}=${paramsToSign[key]}`)
		.join("&");

	// Append API secret
	const stringToSign = sortedParams + CLOUDINARY_API_SECRET;

	// Generate SHA-256 hash
	return crypto.subtle
		.digest("SHA-256", new TextEncoder().encode(stringToSign))
		.then((hashBuffer) => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
		});
};

export const uploadImage = async (
	imageData: string,
	solutionId: string
): Promise<string> => {
	// Validar que las variables de Cloudinary estén configuradas
	if (!CLOUDINARY_URL || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
		console.error(
			"Cloudinary configuration missing. Please set environment variables:"
		);
		console.error("- NEXT_PUBLIC_CLOUDINARY_URL");
		console.error("- NEXT_PUBLIC_CLOUDINARY_API_KEY");
		console.error("- NEXT_PUBLIC_CLOUDINARY_API_SECRET");
		throw new Error(
			"Cloudinary configuration is missing. Image upload is disabled."
		);
	}

	try {
		// Si imageData es un data URL (data:image/jpeg;base64,...), convertir directamente a blob
		let blob: Blob;
		if (imageData.startsWith("data:")) {
			const response = await fetch(imageData);
			blob = await response.blob();
		} else {
			// Si es una URL HTTP, hacer fetch
			const response = await fetch(imageData);
			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.statusText}`);
			}
			blob = await response.blob();
		}

		const file = new File([blob], `${solutionId}.jpg`, {
			type: "image/jpeg",
		});

		const timestamp = Math.floor(Date.now() / 1000).toString();
		const signature = await generateSignature(solutionId, timestamp);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("public_id", solutionId);
		formData.append("overwrite", "true");
		formData.append("api_key", CLOUDINARY_API_KEY);
		formData.append("signature", signature);
		formData.append("timestamp", timestamp);

		const uploadResponse = await fetch(CLOUDINARY_URL, {
			method: "POST",
			body: formData,
		});

		if (!uploadResponse.ok) {
			const errorText = await uploadResponse.text();
			console.error("Cloudinary upload error:", errorText);
			throw new Error(
				`Cloudinary upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
			);
		}

		const data = await uploadResponse.json();
		if (!data.secure_url) {
			throw new Error("Cloudinary response missing secure_url");
		}
		return data.secure_url;
	} catch (error) {
		console.error("Error uploading image:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Image upload failed");
	}
};
