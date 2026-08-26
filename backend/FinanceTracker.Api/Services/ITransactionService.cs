using FinanceTracker.Api.DTOs;

namespace FinanceTracker.Api.Services;

public interface ITransactionService
{
    Task<List<TransactionResponseDto>> GetAllAsync(Guid userId, TransactionFilterDto filter);
    Task<TransactionResponseDto> CreateAsync(Guid userId, CreateTransactionDto request);
    Task<TransactionResponseDto> UpdateAsync(Guid userId, Guid transactionId, CreateTransactionDto request);
    Task DeleteAsync(Guid userId, Guid transactionId);
}
