namespace PDF_API
{
    public class PDFFile
    {
        public int Id { get; set; }
        public string SecuredId { get; set; }
        public string Path { get; set; }
        public DateTime LastActivityTime { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
