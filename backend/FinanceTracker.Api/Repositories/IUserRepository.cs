using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}
