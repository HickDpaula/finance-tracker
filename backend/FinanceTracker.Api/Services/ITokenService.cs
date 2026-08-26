using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;

namespace FinanceTracker.Api.Services;

public interface ITokenService
{
    LoginResponseDto GenerateToken(User user);
}
