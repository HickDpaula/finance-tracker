using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;
using FinanceTracker.Api.Repositories;

namespace FinanceTracker.Api.Services;

public class DashboardService(ITransactionRepository transactionRepository) : IDashboardService
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid userId, DateOnly? from, DateOnly? to)
    {
        var transactions = await transactionRepository.GetAllAsync(userId, new TransactionFilterDto(from, to, null));

        var totalIncome = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
        var totalExpenses = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

        return new DashboardSummaryDto(totalIncome, totalExpenses, totalIncome - totalExpenses);
    }
}
