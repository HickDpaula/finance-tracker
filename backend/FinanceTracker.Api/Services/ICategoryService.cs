using FinanceTracker.Api.DTOs;

namespace FinanceTracker.Api.Services;

public interface ICategoryService
{
    Task<List<CategoryResponseDto>> GetAllAsync(Guid userId);
    Task<CategoryResponseDto> CreateAsync(Guid userId, CreateCategoryDto request);
    Task<CategoryResponseDto> UpdateAsync(Guid userId, Guid categoryId, CreateCategoryDto request);
    Task DeleteAsync(Guid userId, Guid categoryId);
}
