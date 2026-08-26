using FinanceTracker.Api.Data;
using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Repositories;

public class TransactionRepository(AppDbContext context) : ITransactionRepository
{
    public async Task<List<Transaction>> GetAllAsync(Guid userId, TransactionFilterDto filter)
    {
        var query = context.Transactions.Where(t => t.UserId == userId);

        if (filter.From is not null)
        {
            query = query.Where(t => t.Date >= filter.From);
        }

        if (filter.To is not null)
        {
            query = query.Where(t => t.Date <= filter.To);
        }

        if (filter.CategoryId is not null)
        {
            query = query.Where(t => t.CategoryId == filter.CategoryId);
        }

        return await query.OrderByDescending(t => t.Date).ToListAsync();
    }

    public Task<Transaction?> GetByIdAsync(Guid id, Guid userId) =>
        context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

    public async Task AddAsync(Transaction transaction)
    {
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Transaction transaction)
    {
        context.Transactions.Update(transaction);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Transaction transaction)
    {
        context.Transactions.Remove(transaction);
        await context.SaveChangesAsync();
    }
}
