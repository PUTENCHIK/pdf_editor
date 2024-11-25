namespace PDF_API.Models { 
    public class PDFException : Exception {
        string message;
        public PDFException(string message) {
            this.message = message;
        }
    }
}
