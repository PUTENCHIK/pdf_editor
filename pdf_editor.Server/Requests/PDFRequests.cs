namespace pdf_editor.Server.Requests {
    public class DeletePageRequest {
        public IFormFile file { get; set; }
        public int pageNumber { get; set; }
    }

    public class CanFileBeUploadedRequest {
        public IFormFile file { get; set; }
    }

    public class GetPageCountRequest {
        public IFormFile file { get; set; }
    }

    public class SwapPagesRequest {
        public IFormFile file { get; set; }
        public int pageFrom { get; set; }
        public int pageTo { get; set; }
    }

    public class CombinePdfFilesRequest {
        public IFormFile file { get; set; }
        public IFormFile file2 { get; set; }
    }

    public class InsertImageRequest {
        public IFormFile file { get; set; }
        public IFormFile imageFile { get; set; }
        public int pageNumber { get; set; }
        public float width { get; set; }
        public float height { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }

    public class RotatePagesRequest {
        public IFormFile file { get; set; }
        public int degrees { get; set; }
    }

    public class AddTextRequest {
        public IFormFile file { get; set; }
        public string text { get; set; }
        public int pageNumber { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public float fontSize { get; set; }
        public string font { get; set; }
        public bool isBold { get; set; }
        public string fontColor { get; set; }
    }

    public class CropPageRequest {
        public IFormFile file { get; set; }
        public int pageNumber { get; set; }
        public float width { get; set; }
        public float height { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }

}
