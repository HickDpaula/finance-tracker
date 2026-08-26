using FinanceTracker.Api.Data;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public Task<List<Category>> GetAllByUserIdAsync(Guid userId) =>
        context.Categories.Where(c => c.UserId == userId).OrderBy(c => c.Name).ToListAsync();

    public Task<Category?> GetByIdAsync(Guid id, Guid userId) =>
        context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

    public Task<bool> ExistsByNameAsync(Guid userId, string name) =>
        context.Categories.AnyAsync(c => c.UserId == userId && c.Name == name);

    public async Task AddAsync(Category category)
    {
        context.Categories.Add(category);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Category category)
    {
        context.Categories.Update(category);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Category category)
    {
        context.Categories.Remove(category);
        await context.SaveChangesAsync();
    }
}
