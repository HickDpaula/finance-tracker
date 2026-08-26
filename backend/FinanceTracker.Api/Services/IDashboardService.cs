using FinanceTracker.Api.DTOs;

namespace FinanceTracker.Api.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(Guid userId, DateOnly? from, DateOnly? to);
}
