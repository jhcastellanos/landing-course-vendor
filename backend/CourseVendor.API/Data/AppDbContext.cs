using Microsoft.EntityFrameworkCore;
using CourseVendor.API.Models;

namespace CourseVendor.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Course> Courses { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Purchase> Purchases { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Course configuration
        modelBuilder.Entity<Course>(entity =>
        {
            entity.ToTable("courses");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Description).HasColumnName("description").IsRequired();
            entity.Property(e => e.ImageUrl).HasColumnName("image_url").IsRequired();
            entity.Property(e => e.FullPrice).HasColumnName("full_price").HasColumnType("decimal(10,2)");
            entity.Property(e => e.DiscountPercentage).HasColumnName("discount_percentage").HasColumnType("decimal(5,2)");
            entity.Property(e => e.FinalPrice).HasColumnName("final_price").HasColumnType("decimal(10,2)");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // Customer configuration
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("customers");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            entity.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Purchase configuration
        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.ToTable("purchases");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.PurchaseCode).HasColumnName("purchase_code").HasMaxLength(50).IsRequired();
            entity.Property(e => e.AmountPaid).HasColumnName("amount_paid").HasColumnType("decimal(10,2)");
            entity.Property(e => e.PaymentMethod).HasColumnName("payment_method").HasMaxLength(50);
            entity.Property(e => e.PaypalTransactionId).HasColumnName("paypal_transaction_id").HasMaxLength(255);
            entity.Property(e => e.PaymentStatus).HasColumnName("payment_status").HasMaxLength(50);
            entity.Property(e => e.PurchasedAt).HasColumnName("purchased_at");
            entity.Property(e => e.EmailSent).HasColumnName("email_sent");
            
            entity.HasIndex(e => e.PurchaseCode).IsUnique();
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Purchases)
                .HasForeignKey(e => e.CustomerId);
            
            entity.HasOne(e => e.Course)
                .WithMany(c => c.Purchases)
                .HasForeignKey(e => e.CourseId);
        });
    }
}
