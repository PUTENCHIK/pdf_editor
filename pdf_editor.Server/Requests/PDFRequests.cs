﻿namespace pdf_editor.Server.Requests {
    public class StartEditing {
        public IFormFile file { get; set; }
    }

    public class DeletePageRequest {
        public string fileId { get; set; }
        public int pageNumber { get; set; }
    }

    public class GetPageCountRequest {
        public string fileId { get; set; }
    }

    public class SwapPagesRequest {
        public string fileId { get; set; }
        public int pageFrom { get; set; }
        public int pageTo { get; set; }
    }

    public class CombinePdfFilesRequest {
        public IFormFile file { get; set; }
        public IFormFile file2 { get; set; }
    }

    public class CompressPdfFileRequest {
        public IFormFile file { get; set; }
        public int compressionRatio { get; set; }
    }

    public class SplitPdfFileRequest {
        public IFormFile file { get; set; }

        public int breakPageNumber { get; set; }
    }

    public class InsertImageRequest {
        public string fileId { get; set; }
        public IFormFile imageFile { get; set; }
        public int pageNumber { get; set; }
        public float width { get; set; }
        public float height { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }

    public class RotatePagesRequest {
        public string fileId { get; set; }
    }

    public class RotatePageRequest {
        public string fileId { get; set; }
        public int pageNumber { get; set; }
    }

    public class AddTextRequest {
        public string fileId { get; set; }
        public string text { get; set; }
        public int pageNumber { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public float fontSize { get; set; }
        public string font { get; set; }
        public bool isBold { get; set; }
        public bool isItalic { get; set; }
        public bool isUnderline { get; set; }
        public string htmlColorCode { get; set; }
    }

    public class EditTextRequest {
        public string fileId { get; set; }
        public string text { get; set; }
        public int pageNumber { get; set; }
        public int x { get; set; }
        public int y { get; set; }
        public float fontSize { get; set; }
        public string font { get; set; }
        public bool isBold { get; set; }
        public bool isItalic { get; set; }
        public bool isUnderline { get; set; }
        public string htmlColorCodeText { get; set; }
        public string htmlColorCodeBackground { get; set; }
    }

    public class CropPageRequest {
        public string fileId { get; set; }
        public int pageNumber { get; set; }
        public float width { get; set; }
        public float height { get; set; }
        public int x { get; set; }
        public int y { get; set; }
    }

    public class DeleteTextRequest {
        public string fileId { get; set; }
        public int pageNumber { get; set; }
        public int x1 { get; set; }
        public int y1 { get; set; }
        public int x2 { get; set; }
        public int y2 { get; set; }
    }

    public class WordTopPdfConvertRequest {
        public IFormFile file { get; set; }
    }

    public class GetFontsRequest {
        public string fileId { get; set; }
    }
}
