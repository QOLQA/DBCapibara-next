const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL || '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || '';
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';

const generateSignature = async (publicId: string, timestamp: string): Promise<string> => {
	// Create the string to hash
	const paramsToSign: Record<string, string> = {
		public_id: publicId,
		timestamp: timestamp,
		upload_preset: UPLOAD_PRESET,
		overwrite: 'true',
	};

	// Sort parameters alphabetically
	const sortedParams = Object.keys(paramsToSign)
		.sort()
		.map(key => `${key}=${paramsToSign[key]}`)
		.join('&');

	// Append API secret
	const stringToSign = sortedParams + CLOUDINARY_API_SECRET;

	// Generate SHA-1 hash
	return crypto.subtle.digest('SHA-256', new TextEncoder().encode(stringToSign))
		.then(hashBuffer => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		});
}

export const uploadImage = async (imageData: string, solutionId: string): Promise<string> => {
	try {
		const response = await fetch(imageData);
		const blob = await response.blob();

		const file = new File([blob], solutionId, {
			type: "image/jpeg",
		});

		const timestamp = Math.floor(Date.now() / 1000).toString();
		const signature = await generateSignature(solutionId, timestamp);

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', UPLOAD_PRESET);
		formData.append('public_id', solutionId);
		formData.append('overwrite', 'true');
		formData.append('api_key', CLOUDINARY_API_KEY);
		formData.append('signature', signature);
		formData.append('timestamp', timestamp);

		const uploadResponse = await fetch(
			CLOUDINARY_URL,
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!uploadResponse.ok) {
			throw new Error('Error uploading image');
		}

		const data = await uploadResponse.json();
		return data.secure_url;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Image upload failed");

	}
}