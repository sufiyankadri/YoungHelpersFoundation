using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YHF.Domain.Entities;
using YHF.Infrastructure.Persistence;

namespace YHF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DonationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Donation>>> GetDonations()
    {
        return await _context.Donations
                             .Include(d => d.Cause)
                             .OrderByDescending(d => d.CreatedAt)
                             .Take(50)
                             .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Donation>> CreateDonation(Donation donation)
    {
        donation.Id = Guid.NewGuid();
        donation.CreatedAt = DateTime.UtcNow;
        donation.ReceiptNumber = $"YHF-REC-2026-{Random.Shared.Next(10000, 99999)}";
        donation.Status = DonationStatus.Captured;

        if (donation.CauseId.HasValue)
        {
            var cause = await _context.Causes.FindAsync(donation.CauseId.Value);
            if (cause != null)
            {
                cause.RaisedAmount += donation.Amount;
                cause.DonorCount += 1;
            }
        }

        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDonations), new { id = donation.Id }, donation);
    }
}
