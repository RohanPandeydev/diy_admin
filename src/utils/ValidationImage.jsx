const validateFileImage = (file,MAX_FILE_SIZE_MB,allowedExtensionsImage) => {
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    let isValid = true;
    let errorMessage = "";

    const fileNameParts = file.name.split(".");
    const extension = `.${fileNameParts[
        fileNameParts.length - 1
    ].toLowerCase()}`;

    if (!allowedExtensionsImage.includes(extension)) {
        isValid = false;
        errorMessage = `Invalid file extension: ${extension}. Allowed extensions are: ${allowedExtensionsImage.join(
            ", "
        )}`;
    } else if (file.size > MAX_FILE_SIZE_BYTES) {
        isValid = false;
        errorMessage = `File size exceeds ${MAX_FILE_SIZE_MB} MB`;
    }

    return { isValid, errorMessage };
};

export default validateFileImage