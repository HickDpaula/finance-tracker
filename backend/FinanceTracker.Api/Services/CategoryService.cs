using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;
using FinanceTracker.Api.Repositories;

namespace FinanceTracker.Api.Services;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<List<CategoryResponseDto>> GetAllAsync(Guid userId)
    {
        var categories = await categoryRepository.GetAllByUserIdAsync(userId);
        return categories.Select(ToDto).ToList();
    }

    public async Task<CategoryResponseDto> CreateAsync(Guid userId, CreateCategoryDto request)
    {
        if (await categoryRepository.ExistsByNameAsync(userId, request.Name))
        {
            throw new InvalidOperationException("Category already exists.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
        };

        await categoryRepository.AddAsync(category);

        return ToDto(category);
    }

    public async Task<CategoryResponseDto> UpdateAsync(Guid userId, Guid categoryId, CreateCategoryDto request)
    {
        var category = await categoryRepository.GetByIdAsync(categoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        if (await categoryRepository.ExistsByNameAsync(userId, request.Name) && category.Name != request.Name)
        {
            throw new InvalidOperationException("Category already exists.");
        }

        category.Name = request.Name;
        await categoryRepository.UpdateAsync(category);

        return ToDto(category);
    }

    public async Task DeleteAsync(Guid userId, Guid categoryId)
    {
        var category = await categoryRepository.GetByIdAsync(categoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        await categoryRepository.DeleteAsync(category);
    }

    private static CategoryResponseDto ToDto(Category category) => new(category.Id, category.Name);
}
