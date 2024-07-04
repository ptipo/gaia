/**
 * Model validation issue codes.
 */
export enum ValidationIssueCode {
    /**
     * Required field is missing.
     */
    Required = 'required',

    /**
     * Required array is empty.
     */
    RequiredArray = 'required-array',

    /**
     * Invalid value.
     */
    InvalidValue = 'invalid-value',
}
