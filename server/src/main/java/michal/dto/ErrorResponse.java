package michal.dto;

public record ErrorResponse(
        String field,
        String code
) {}
