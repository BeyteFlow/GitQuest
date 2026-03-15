
using GitQuest.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GitQuest.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly GitQuestContext _context;

    public ProjectsController(GitQuestContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        return Ok(await _context.Projects.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return Ok(project);
    }
}