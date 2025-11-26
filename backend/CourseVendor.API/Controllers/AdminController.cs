using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseVendor.API.Data;
using CourseVendor.API.Models;
using CourseVendor.API.Models.DTOs;

namespace CourseVendor.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<AdminController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    public ActionResult<AdminLoginResponse> Login([FromBody] AdminLoginRequest request)
    {
        var adminUsername = _configuration["Admin:Username"];
        var adminPassword = _configuration["Admin:Password"];

        if (string.IsNullOrEmpty(adminUsername) || string.IsNullOrEmpty(adminPassword))
        {
            return Unauthorized(new AdminLoginResponse
            {
                Success = false,
                Message = "Admin credentials not configured"
            });
        }

        if (request.Username == adminUsername && request.Password == adminPassword)
        {
            // Simple token (in production, use JWT)
            var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{request.Username}:{DateTime.UtcNow.Ticks}"));
            
            return Ok(new AdminLoginResponse
            {
                Success = true,
                Token = token,
                Message = "Login successful"
            });
        }

        return Unauthorized(new AdminLoginResponse
        {
            Success = false,
            Message = "Invalid credentials"
        });
    }

    [HttpGet("courses")]
    public async Task<ActionResult<IEnumerable<Course>>> GetAllCourses()
    {
        var courses = await _context.Courses
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(courses);
    }

    [HttpPost("courses")]
    public async Task<ActionResult<Course>> CreateCourse([FromBody] CreateCourseRequest request)
    {
        var finalPrice = request.FullPrice * (1 - request.DiscountPercentage / 100);

        var course = new Course
        {
            Name = request.Name,
            Title = request.Title,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            FullPrice = request.FullPrice,
            DiscountPercentage = request.DiscountPercentage,
            FinalPrice = finalPrice,
            IsActive = true,
            StartDate = request.StartDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllCourses), new { id = course.Id }, course);
    }

    [HttpPut("courses/{id}")]
    public async Task<ActionResult<Course>> UpdateCourse(int id, [FromBody] UpdateCourseRequest request)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound();
        }

        course.Name = request.Name;
        course.Title = request.Title;
        course.Description = request.Description;
        course.ImageUrl = request.ImageUrl;
        course.FullPrice = request.FullPrice;
        course.DiscountPercentage = request.DiscountPercentage;
        course.FinalPrice = request.FullPrice * (1 - request.DiscountPercentage / 100);
        course.IsActive = request.IsActive;
        course.StartDate = request.StartDate;
        course.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(course);
    }

    [HttpDelete("courses/{id}")]
    public async Task<ActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound();
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("purchases")]
    public async Task<ActionResult> GetPurchases([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Purchases
            .Include(p => p.Customer)
            .Include(p => p.Course)
            .OrderByDescending(p => p.PurchasedAt);

        var total = await query.CountAsync();
        var purchases = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.PurchaseCode,
                Customer = new { p.Customer.Email, p.Customer.FullName },
                Course = new { p.Course.Name },
                p.AmountPaid,
                p.PaymentMethod,
                p.PaymentStatus,
                p.PurchasedAt
            })
            .ToListAsync();

        return Ok(new
        {
            Total = total,
            Page = page,
            PageSize = pageSize,
            Data = purchases
        });
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var totalCourses = await _context.Courses.CountAsync();
        var activeCourses = await _context.Courses.CountAsync(c => c.IsActive);
        var totalPurchases = await _context.Purchases.CountAsync();
        var totalRevenue = await _context.Purchases
            .Where(p => p.PaymentStatus == "COMPLETED")
            .SumAsync(p => p.AmountPaid);
        var totalCustomers = await _context.Customers.CountAsync();

        var recentPurchases = await _context.Purchases
            .Include(p => p.Customer)
            .Include(p => p.Course)
            .OrderByDescending(p => p.PurchasedAt)
            .Take(5)
            .Select(p => new
            {
                p.PurchaseCode,
                CustomerEmail = p.Customer.Email,
                CourseName = p.Course.Name,
                p.AmountPaid,
                p.PurchasedAt
            })
            .ToListAsync();

        return Ok(new
        {
            TotalCourses = totalCourses,
            ActiveCourses = activeCourses,
            TotalPurchases = totalPurchases,
            TotalRevenue = totalRevenue,
            TotalCustomers = totalCustomers,
            RecentPurchases = recentPurchases
        });
    }

    [HttpGet("courses/{courseId}/customers")]
    public async Task<ActionResult> GetCourseCustomers(int courseId)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null)
        {
            return NotFound(new { Message = "Course not found" });
        }

        var customers = await _context.Purchases
            .Include(p => p.Customer)
            .Where(p => p.CourseId == courseId && p.PaymentStatus == "COMPLETED")
            .OrderByDescending(p => p.PurchasedAt)
            .Select(p => new
            {
                p.Customer.Id,
                p.Customer.Email,
                p.Customer.FullName,
                p.PurchaseCode,
                p.AmountPaid,
                p.PurchasedAt,
                p.PaymentStatus
            })
            .ToListAsync();

        return Ok(new
        {
            CourseId = courseId,
            CourseName = course.Name,
            TotalCustomers = customers.Count,
            Customers = customers
        });
    }
}
