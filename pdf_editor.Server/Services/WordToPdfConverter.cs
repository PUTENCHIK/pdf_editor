using pdf_editor.Server.Services;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace pdf_editor.Server.Services {
    public class WordToPdfConverter : IWordToPdfConverter {
        private readonly ILogger<WordToPdfConverter> _logger;
        private readonly IConfiguration _configuration;
        private readonly int _libreOfficeTimeoutSeconds = 60; // Добавили таймаут

        public WordToPdfConverter(ILogger<WordToPdfConverter> logger, IConfiguration configuration) {
            _logger = logger;
            _configuration = configuration;
            //Можно добавить проверку конфигурации на наличие таймаута
            if (int.TryParse(_configuration["LibreOfficeTimeoutSeconds"], out int timeout)) {
                _libreOfficeTimeoutSeconds = timeout;
            }
        }

        public async Task<(bool Success, string? ErrorMessage)> ConvertWordToPdfAsync(string wordFilePath, string pdfFilePath) {
            try {
                if (!File.Exists(wordFilePath)) {
                    return (false, $"Input file not found: {wordFilePath}");
                }

                string libreOfficePath = _configuration["LibreOfficePath"];
                if (string.IsNullOrEmpty(libreOfficePath)) {
                    return (false, "The path to LibreOffice is not configured.");
                }

                string arguments = $"--headless --convert-to pdf \"{wordFilePath}\" --outdir \"{Path.GetDirectoryName(pdfFilePath)}\"";
                _logger.LogInformation($"Starting LibreOffice: {libreOfficePath} {arguments}");

                ProcessStartInfo processInfo = new ProcessStartInfo {
                    FileName = libreOfficePath,
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (Process process = new Process()) {
                    process.StartInfo = processInfo;
                    process.Start();

                    string output = await process.StandardOutput.ReadToEndAsync();
                    string error = await process.StandardError.ReadToEndAsync();


                    bool processCompleted;

                    CancellationTokenSource cts = new CancellationTokenSource(_libreOfficeTimeoutSeconds * 1000);
                    try {
                        await process.WaitForExitAsync(cts.Token);
                        processCompleted = true;
                    }
                    catch (OperationCanceledException) {
                        processCompleted = false;
                        process.Kill();
                        return (false, $"LibreOffice timed out after {_libreOfficeTimeoutSeconds} seconds.");
                    }
                    catch (Exception ex) {
                        processCompleted = false;
                        return (false, $"An error occurred while waiting for LibreOffice to exit: {ex.Message}");
                    }


                    if (!processCompleted) {
                        process.Kill(); 
                        return (false, $"LibreOffice timed out after {_libreOfficeTimeoutSeconds} seconds.");
                    }

                    if (process.ExitCode != 0) {
                        return (false, $"LibreOffice conversion failed with exit code {process.ExitCode}: {error}");
                    }

                    _logger.LogInformation($"LibreOffice finished successfully. Output: {output}");


                    string tempPdfPath = Path.Combine(Path.GetDirectoryName(pdfFilePath), Path.GetFileNameWithoutExtension(wordFilePath) + ".pdf");
                    if (File.Exists(tempPdfPath)) {
                        if (File.Exists(pdfFilePath)) {
                            return (false, $"Output file already exists: {pdfFilePath}");
                        }
                        File.Move(tempPdfPath, pdfFilePath);
                    }
                    else {
                        return (false, $"LibreOffice didn't produce expected output file: {tempPdfPath}");
                    }

                    return (true, null);
                }
            }
            catch (Exception ex) {
                return (false, $"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}