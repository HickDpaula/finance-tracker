using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Name).IsRequired().HasMaxLength(150);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => new { c.UserId, c.Name }).IsUnique();
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.HasOne<User>().WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.Description).IsRequired().HasMaxLength(200);
            entity.Property(t => t.Amount).HasColumnType("numeric(12,2)");
            entity.HasIndex(t => new { t.UserId, t.Date });
            entity.HasOne<User>().WithMany().HasForeignKey(t => t.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne<Category>().WithMany().HasForeignKey(t => t.CategoryId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
