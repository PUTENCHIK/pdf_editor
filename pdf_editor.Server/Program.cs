

using Microsoft.EntityFrameworkCore;
using PDF_API.Data;
using pdf_editor.Server.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHostedService<FileCleanupService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("pdf_editor")));

builder.Services.AddScoped<IWordToPdfConverter, WordToPdfConverter>();

builder.Services.AddLogging();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("System", LogLevel.Warning);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAllOrigins", policyBuilder => {
        policyBuilder.WithOrigins("https://localhost:7199", "https://localhost:59404", "https://localhost:3000", "http://localhost:5221", "https://localhost:7282");
        policyBuilder.AllowAnyHeader();
        policyBuilder.AllowAnyMethod();
        policyBuilder.AllowCredentials();
    });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseMiddleware<RequestIdMiddleware>();


if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthorization();



app.MapControllers();

app.MapFallbackToFile("/index.html");



app.Run();
