export function formatZodErrors(error) {
    const fieldToMessage = {};
    for (const issue of error.issues) {
        // If path is empty, it's a root-level error (usually missing/invalid object)
        // For root errors about expected object, we'll extract field info from nested issues
        if (issue.path.length === 0) {
            // Check if it's an object expected error
            if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'object') {
                // Look for nested issues that tell us about missing fields
                continue; // Skip root error, let field-level errors show instead
            }
            // For other root errors, use a generic message
            fieldToMessage['root'] = issue.message;
            continue;
        }
        // Build field name from path (e.g., ["user", "name"] -> "user.name")
        const fieldPath = issue.path.join('.');
        // Get the last part of the path as the field name
        const lastPathPart = issue.path[issue.path.length - 1];
        const fieldName = typeof lastPathPart === 'string' ? lastPathPart : String(lastPathPart);
        // Format field name nicely (e.g., "mobile_number" -> "Mobile number")
        const formattedFieldName = fieldName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        // Determine the error message - prioritize checking message content first
        let message = issue.message;
        // First check for the specific error message pattern we want to replace
        if (issue.message.includes('Invalid input: expected string, received undefined') ||
            issue.message.includes('expected string, received undefined')) {
            message = `${formattedFieldName} is required`;
        }
        // Check error code for invalid_type with undefined received
        else if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'string' && 'received' in issue && issue.received === 'undefined') {
            message = `${formattedFieldName} is required`;
        }
        // Check for too_small errors with generic messages
        else if (issue.code === 'too_small' && 'type' in issue && issue.type === 'string') {
            // Use custom message from schema if available, otherwise format it
            if (issue.message.includes('must contain at least') && !issue.message.toLowerCase().includes('required')) {
                message = `${formattedFieldName} is required`;
            }
        }
        // Only set if not already set (first error for this field wins)
        if (!fieldToMessage[fieldPath]) {
            fieldToMessage[fieldPath] = message;
        }
    }
    return fieldToMessage;
}
export function validateWithZod(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return {
            success: true,
            message: 'Validated'
        };
    }
    return {
        success: false,
        message: 'Validation',
        errors: formatZodErrors(result.error)
    };
}
// Express middleware: validate selected request part with the provided Zod schema
// - On success: replaces the request part with parsed data and calls next()
// - On failure: returns standardized validation response and does NOT call next()
export function zodValidate(schema, part = 'body') {
    return (req, res, next) => {
        // Default to empty object if the request part is undefined/null
        // This prevents "root" errors and allows field-level validation errors
        const dataToValidate = req[part] ?? {};
        const result = schema.safeParse(dataToValidate);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation',
                errors: formatZodErrors(result.error)
            });
        }
        // Replace with parsed/coerced data so downstream handlers get typed/clean input
        req[part] = result.data;
        return next();
    };
}
