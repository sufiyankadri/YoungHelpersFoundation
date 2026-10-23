using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YHF.Domain.Entities;
using YHF.Infrastructure.Persistence;

namespace YHF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CausesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CausesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cause>>> GetCauses([FromQuery] string? category = null)
    {
        var query = _context.Causes.AsQueryable();

        if (!string.IsNullOrEmpty(category) && Enum.TryParse<CauseCategory>(category, true, out var cat))
        {
            query = query.Where(c => c.Category == cat);
        }

        return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cause>> GetCause(Guid id)
    {
        var cause = await _context.Causes.FindAsync(id);
        if (cause == null) return NotFound();
        return cause;
    }

    [HttpPost]
    public async Task<ActionResult<Cause>> CreateCause(Cause cause)
    {
        cause.Id = Guid.NewGuid();
        cause.CreatedAt = DateTime.UtcNow;
        _context.Causes.Add(cause);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCause), new { id = cause.Id }, cause);
    }
}
