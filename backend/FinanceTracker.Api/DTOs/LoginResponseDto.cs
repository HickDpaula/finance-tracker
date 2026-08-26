namespace FinanceTracker.Api.DTOs;

public record LoginResponseDto(string Token, DateTime ExpiresAt);
