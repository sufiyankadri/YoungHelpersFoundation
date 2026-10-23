using Microsoft.EntityFrameworkCore;
using YHF.Domain.Entities;
using YHF.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=yhf.db"));

// Enable CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://sufiyankadri.github.io")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Seed initial database & mock records
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Causes.Any())
    {
        db.Causes.AddRange(
            new Cause
            {
                Code = "YHF-RZ-2026-001",
                Title = "Ek Rozgaar: Certified Electrician Commercial Toolkit Setup",
                Tagline = "Supporting a certified diploma holder with industrial tools to start his own mobile electrical repair services.",
                Category = CauseCategory.Rozgaar,
                FundType = FundType.Zakat,
                TargetAmount = 38500,
                RaisedAmount = 31200,
                DonorCount = 42,
                DaysLeft = 8,
                Location = "Old Delhi, Delhi",
                VerifiedDate = "18 Oct 2026",
                ShariahCompliant = true,
                CoverImage = "cause_electrician.jpg",
                Story = "Aadil has completed his ITI Electrical certification. Providing this toolkit transfers permanent asset ownership (Tamleek), making his family self-reliant.",
                AssetToolName = "Bosch Professional Toolkit & Digital Multimeter Set",
                ExpectedMonthlyIncome = 24000,
                Day30Status = "Tool verification & first 15 domestic clients",
                Day90Status = "Commercial shop tie-ups & independent income"
            },
            new Cause
            {
                Code = "YHF-RZ-2026-002",
                Title = "Ek Zakat Ek Rozgaar: Industrial Sewing Machine for Widow Mother",
                Tagline = "Enabling a skilled mother of 3 children to run tailoring services from home with industrial stitching gear.",
                Category = CauseCategory.Rozgaar,
                FundType = FundType.Zakat,
                TargetAmount = 26000,
                RaisedAmount = 19500,
                DonorCount = 29,
                DaysLeft = 12,
                Location = "Bhopal, MP",
                VerifiedDate = "15 Oct 2026",
                ShariahCompliant = true,
                CoverImage = "cause_tailoring.jpg",
                Story = "Fatima lost her husband two years ago. With a computerized high-speed sewing machine, she can complete bulk school uniform orders.",
                AssetToolName = "Jack F4 Direct Drive Industrial Sewing Machine",
                ExpectedMonthlyIncome = 18000,
                Day30Status = "Initial local boutique supply orders",
                Day90Status = "Stable self-sustained income crossing ₹18,000/mo"
            },
            new Cause
            {
                Code = "YHF-MD-2026-003",
                Title = "Zindagi Bachao: Urgent Pediatric Valve Surgery Assistance",
                Tagline = "Critical hospital bill settlement for a 4-year-old child admitted to intensive cardiac care.",
                Category = CauseCategory.Medical,
                FundType = FundType.Zakat,
                TargetAmount = 85000,
                RaisedAmount = 64000,
                DonorCount = 88,
                DaysLeft = 3,
                Location = "Lucknow, UP",
                VerifiedDate = "21 Oct 2026",
                ShariahCompliant = true,
                IsUrgent = true,
                CoverImage = "cause_medical.jpg",
                Story = "Baby Arham was diagnosed with congenital heart condition. Critical medicine and surgery consumable require urgent support."
            },
            new Cause
            {
                Code = "YHF-EM-2026-004",
                Title = "Emergency Relief: Rebuilding Street Food Cart after Local Fire",
                Tagline = "Providing steel cart, stove, and raw ration to restore daily earning for a breadwinner.",
                Category = CauseCategory.Emergency,
                FundType = FundType.Sadaqah,
                TargetAmount = 32000,
                RaisedAmount = 32000,
                DonorCount = 46,
                DaysLeft = 0,
                Location = "Kanpur, UP",
                VerifiedDate = "10 Oct 2026",
                ShariahCompliant = true,
                CoverImage = "cause_foodcart.jpg",
                Story = "A sudden market electrical fire gutted Imran's small cart. The full target was reached and the cart was handed over."
            }
        );
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
