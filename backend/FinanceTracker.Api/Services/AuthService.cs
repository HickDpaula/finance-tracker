using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Models;
using FinanceTracker.Api.Repositories;
using Microsoft.AspNetCore.Identity;

namespace FinanceTracker.Api.Services;

public class AuthService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher) : IAuthService
{
    public async Task<UserResponseDto> RegisterAsync(RegisterUserDto request)
    {
        if (await userRepository.GetByEmailAsync(request.Email) is not null)
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        await userRepository.AddAsync(user);

        return new UserResponseDto(user.Id, user.Name, user.Email);
    }
}
