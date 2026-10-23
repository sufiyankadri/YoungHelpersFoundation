using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YHF.Domain.Entities;
using YHF.Infrastructure.Persistence;

namespace YHF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ApplicationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HelpApplication>>> GetApplications()
    {
        return await _context.HelpApplications
                             .OrderByDescending(a => a.CreatedAt)
                             .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<HelpApplication>> SubmitApplication(HelpApplication app)
    {
        app.Id = Guid.NewGuid();
        app.TrackingNumber = $"YHF-REQ-2026-{Random.Shared.Next(1000, 9999)}";
        app.Status = ApplicationStatus.Submitted;
        app.CreatedAt = DateTime.UtcNow;

        _context.HelpApplications.Add(app);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplications), new { id = app.Id }, app);
    }
}
