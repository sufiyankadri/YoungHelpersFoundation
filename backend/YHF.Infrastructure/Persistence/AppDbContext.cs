using Microsoft.EntityFrameworkCore;
using YHF.Domain.Entities;

namespace YHF.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Cause> Causes => Set<Cause>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<HelpApplication> HelpApplications => Set<HelpApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Cause>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.TargetAmount).HasPrecision(18, 2);
            entity.Property(c => c.RaisedAmount).HasPrecision(18, 2);
            entity.Property(c => c.ExpectedMonthlyIncome).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Amount).HasPrecision(18, 2);
            entity.HasOne(d => d.Cause)
                  .WithMany()
                  .HasForeignKey(d => d.CauseId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<HelpApplication>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.MonthlyFamilyIncome).HasPrecision(18, 2);
            entity.Property(a => a.QuotationAmount).HasPrecision(18, 2);
        });
    }
}
