using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllByUserIdAsync(Guid userId);
    Task<Category?> GetByIdAsync(Guid id, Guid userId);
    Task<bool> ExistsByNameAsync(Guid userId, string name);
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Category category);
}
