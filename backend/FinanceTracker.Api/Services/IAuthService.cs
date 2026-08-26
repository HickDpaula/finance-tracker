using FinanceTracker.Api.DTOs;

namespace FinanceTracker.Api.Services;

public interface IAuthService
{
    Task<UserResponseDto> RegisterAsync(RegisterUserDto request);
}
