using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseVendor.API.Data;
using CourseVendor.API.Models.DTOs;

namespace CourseVendor.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CoursesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
    {
        var courses = await _context.Courses
            .Where(c => c.IsActive)
            .Select(c => new CourseDto
            {
                Id = c.Id,
                Name = c.Name,
                Title = c.Title,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                FullPrice = c.FullPrice,
                DiscountPercentage = c.DiscountPercentage,
                FinalPrice = c.FinalPrice
            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var course = await _context.Courses
            .Where(c => c.Id == id && c.IsActive)
            .Select(c => new CourseDto
            {
                Id = c.Id,
                Name = c.Name,
                Title = c.Title,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                FullPrice = c.FullPrice,
                DiscountPercentage = c.DiscountPercentage,
                FinalPrice = c.FinalPrice
            })
            .FirstOrDefaultAsync();

        if (course == null)
        {
            return NotFound();
        }

        return Ok(course);
    }
}
