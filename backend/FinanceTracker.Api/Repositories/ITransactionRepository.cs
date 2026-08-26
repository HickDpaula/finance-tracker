using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Repositories;

public interface ITransactionRepository
{
    Task<List<Transaction>> GetAllAsync(Guid userId, TransactionFilterDto filter);
    Task<Transaction?> GetByIdAsync(Guid id, Guid userId);
    Task AddAsync(Transaction transaction);
    Task UpdateAsync(Transaction transaction);
    Task DeleteAsync(Transaction transaction);
}
