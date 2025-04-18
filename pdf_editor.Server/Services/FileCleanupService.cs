using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using PDF_API.Data;
using PDF_API.Models;

namespace pdf_editor.Server.Services {
    public class FileCleanupService : BackgroundService {
        private readonly ILogger<FileCleanupService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public FileCleanupService(ILogger<FileCleanupService> logger, IServiceProvider serviceProvider) {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
            _logger.LogInformation("FileCleanupService запущен.");

            while (!stoppingToken.IsCancellationRequested) {
                try {
                    await CleanupFilesAsync();
                }
                catch (Exception ex) {
                    _logger.LogError(ex, "Произошла ошибка при очистке файлов.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }

            _logger.LogInformation("FileCleanupService остановлен.");
        }

        private async Task CleanupFilesAsync() {
            _logger.LogInformation("Запуск очистки файлов...");


            using (var scope = _serviceProvider.CreateScope()) {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var filesToDelete = dbContext.Files
                    .Where(f => f.LastActivityTime < DateTime.Now.AddHours(-1))
                    .ToList();

                _logger.LogInformation($"Запуск очистки файлов... {DateTime.UtcNow.AddHours(-1)}");
                foreach (var file in filesToDelete) {
                    try {;
                        MyPDF.DeleteFile(file.Path);
                        
                        dbContext.Files.Remove(file);
                    }
                    catch (Exception ex) {
                        _logger.LogError(ex, $"Ошибка при удалении файла: {file.Path}");
                    }
                }

                await dbContext.SaveChangesAsync();
            }

            _logger.LogInformation("Очистка файлов завершена.");
        }
    }
}
