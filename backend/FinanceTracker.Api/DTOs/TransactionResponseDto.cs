using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.DTOs;

public record TransactionResponseDto(
    Guid Id,
    string Description,
    decimal Amount,
    TransactionType Type,
    DateOnly Date,
    Guid CategoryId,
    string CategoryName);
