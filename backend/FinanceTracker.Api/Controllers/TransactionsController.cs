using System.Security.Claims;
using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetAll(
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        [FromQuery] Guid? categoryId)
    {
        var filter = new TransactionFilterDto(from, to, categoryId);
        return Ok(await transactionService.GetAllAsync(UserId, filter));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> Create(CreateTransactionDto request)
    {
        try
        {
            var transaction = await transactionService.CreateAsync(UserId, request);
            return CreatedAtAction(nameof(GetAll), new { id = transaction.Id }, transaction);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransactionResponseDto>> Update(Guid id, CreateTransactionDto request)
    {
        try
        {
            return Ok(await transactionService.UpdateAsync(UserId, id, request));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await transactionService.DeleteAsync(UserId, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
