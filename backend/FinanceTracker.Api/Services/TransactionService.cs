using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;
using FinanceTracker.Api.Repositories;

namespace FinanceTracker.Api.Services;

public class TransactionService(
    ITransactionRepository transactionRepository,
    ICategoryRepository categoryRepository) : ITransactionService
{
    public async Task<List<TransactionResponseDto>> GetAllAsync(Guid userId, TransactionFilterDto filter)
    {
        var transactions = await transactionRepository.GetAllAsync(userId, filter);
        var categories = (await categoryRepository.GetAllByUserIdAsync(userId)).ToDictionary(c => c.Id, c => c.Name);

        return transactions.Select(t => ToDto(t, categories[t.CategoryId])).ToList();
    }

    public async Task<TransactionResponseDto> CreateAsync(Guid userId, CreateTransactionDto request)
    {
        var category = await categoryRepository.GetByIdAsync(request.CategoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Description = request.Description,
            Amount = request.Amount,
            Type = request.Type,
            Date = request.Date,
            CategoryId = request.CategoryId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
        };

        await transactionRepository.AddAsync(transaction);

        return ToDto(transaction, category.Name);
    }

    public async Task<TransactionResponseDto> UpdateAsync(Guid userId, Guid transactionId, CreateTransactionDto request)
    {
        var transaction = await transactionRepository.GetByIdAsync(transactionId, userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        var category = await categoryRepository.GetByIdAsync(request.CategoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        transaction.Description = request.Description;
        transaction.Amount = request.Amount;
        transaction.Type = request.Type;
        transaction.Date = request.Date;
        transaction.CategoryId = request.CategoryId;

        await transactionRepository.UpdateAsync(transaction);

        return ToDto(transaction, category.Name);
    }

    public async Task DeleteAsync(Guid userId, Guid transactionId)
    {
        var transaction = await transactionRepository.GetByIdAsync(transactionId, userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        await transactionRepository.DeleteAsync(transaction);
    }

    private static TransactionResponseDto ToDto(Transaction transaction, string categoryName) => new(
        transaction.Id,
        transaction.Description,
        transaction.Amount,
        transaction.Type,
        transaction.Date,
        transaction.CategoryId,
        categoryName);
}
