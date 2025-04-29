namespace pdf_editor.Server.Services {
    public interface IWordToPdfConverter {
        Task<(bool Success, string? ErrorMessage)> ConvertWordToPdfAsync(string wordFilePath, string pdfFilePath);
    }
}
