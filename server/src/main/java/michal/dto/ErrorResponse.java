package michal.dto;

/**
 * Standard API error response returned when a request fails.
 *
 * <p>
 * This class is used to provide a consistent and predictable error structure
 * to the frontend, regardless of the type of exception that occurred.
 * </p>
 */
public record ErrorResponse(
        String field,
        String code
) {}
