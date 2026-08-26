namespace FinanceTracker.Api.DTOs;

public record TransactionFilterDto(DateOnly? From, DateOnly? To, Guid? CategoryId);
