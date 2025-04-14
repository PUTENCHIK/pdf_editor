using Microsoft.EntityFrameworkCore;

namespace PDF_API.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<PDFFile> Files { get; set; }

        public AppDbContext() => Database.EnsureCreated();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        //    optionsBuilder.UseSqlServer(@"Data Source=Toster123\SQLEXPRESS;Initial Catalog=pdfEditor;Integrated Security=True;Encrypt=False   ");
        //}
    }
}
