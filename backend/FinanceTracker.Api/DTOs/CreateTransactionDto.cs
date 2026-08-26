using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.DTOs;

public record CreateTransactionDto(
    string Description,
    decimal Amount,
    TransactionType Type,
    DateOnly Date,
    Guid CategoryId);
