using System.Security.Claims;
using FinanceTracker.Api.DTOs;
using FinanceTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<CategoryResponseDto>>> GetAll()
    {
        return Ok(await categoryService.GetAllAsync(UserId));
    }

    [HttpPost]
    public async Task<ActionResult<CategoryResponseDto>> Create(CreateCategoryDto request)
    {
        try
        {
            var category = await categoryService.CreateAsync(UserId, request);
            return CreatedAtAction(nameof(GetAll), new { id = category.Id }, category);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CategoryResponseDto>> Update(Guid id, CreateCategoryDto request)
    {
        try
        {
            return Ok(await categoryService.UpdateAsync(UserId, id, request));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await categoryService.DeleteAsync(UserId, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
