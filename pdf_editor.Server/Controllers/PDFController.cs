using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PDF_API.Data;
using PDF_API.Models;
using pdf_editor.Server.Models;
using pdf_editor.Server.Requests;
using pdf_editor.Server.Services;
using System.IO.Compression;


namespace PDF_API.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase {
        private readonly IWordToPdfConverter _wordToPdfConverter;
        private readonly ILogger<PDFController> _logger;
        private readonly AppDbContext _context;

        public PDFController(ILogger<PDFController> logger, AppDbContext context, IWordToPdfConverter wordToPdfConverter) {
            _logger = logger;
            _context = context;
            _wordToPdfConverter = wordToPdfConverter;

            string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(directoryPath)) {
                Directory.CreateDirectory(directoryPath);
            }

            string uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "pdf");
            if (!Directory.Exists(uploadFolder)) {
                Directory.CreateDirectory(uploadFolder);
            }
        }

        [HttpPost("start-editing")]
        public IActionResult StartEditing(StartEditing data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                MyPDF.CanBeUpload(data.file);
                string filePath = MyPDF.Upload(data.file);
                string securedFileId = DbPDF.Add(_context, filePath);

                return Ok(new { fileId = securedFileId });
            }
            catch (PDFException e) {
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("get-page-count")]
        public IActionResult GetPageCount(GetPageCountRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                int pageCount = MyPDF.GetPageCount(pdfPath);

                return Ok(pageCount);
            }
            catch (PDFException e) {
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("get-fonts")]
        public IActionResult GetFonts(GetFontsRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                List<string> fonts = MyPDF.GetAllFonts();

                return Ok(fonts);
            }
            catch (PDFException e) {
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("delete-page")]
        public async Task<ActionResult> DeletePage(DeletePageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.DeletePage(filePath, data.pageNumber);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("swap-pages")]
        public async Task<ActionResult> SwapPages(SwapPagesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.SwapPages(filePath, data.pageFrom, data.pageTo);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("combine-pdf-files")]
        public async Task<ActionResult> CombinePdfFiles(CombinePdfFilesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            string? filePath = null;
            string? filePath2 = null;
            string? newPdfPath = null;

            try {
                MyPDF.CanBeUpload(data.file);
                filePath = MyPDF.Upload(data.file);
                MyPDF.CanBeUpload(data.file2);
                filePath2 = MyPDF.Upload(data.file2);

                newPdfPath = MyPDF.CombineFiles(filePath, filePath2);


                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);
                MyPDF.DeleteFile(filePath);
                MyPDF.DeleteFile(filePath2);
                MyPDF.DeleteFile(newPdfPath);

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (filePath2 != null) {
                    MyPDF.DeleteFile(filePath2);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (filePath2 != null) {
                    MyPDF.DeleteFile(filePath2);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("compress-pdf-file")]
        public async Task<ActionResult> CompressPdfFile(CompressPdfFileRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            string? filePath = null;
            string? newPdfPath = null;

            try {
                MyPDF.CanBeUpload(data.file);
                filePath = MyPDF.Upload(data.file);

                newPdfPath = MyPDF.CompressFile(filePath, data.compressionRatio);

                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);
                MyPDF.DeleteFile(filePath);
                MyPDF.DeleteFile(newPdfPath);

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("split-file")]
        public async Task<ActionResult> SplitFile(SplitPdfFileRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            string? filePath = null;
            string? newPdfPath = null;

            try {
                MyPDF.CanBeUpload(data.file);
                filePath = MyPDF.Upload(data.file);

                newPdfPath = MyPDF.SplitFile(filePath, data.breakPageNumber);

                using (var memoryStream = new MemoryStream()) {
                    using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true)) {
                        var firstFileInZip = archive.CreateEntry("file1.pdf");
                        using (var entryStream = firstFileInZip.Open())
                        using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read)) {
                            fileStream.CopyTo(entryStream);
                        }

                        var secondFileInZip = archive.CreateEntry("file2.pdf");
                        using (var entryStream = secondFileInZip.Open())
                        using (var fileStream = new FileStream(newPdfPath, FileMode.Open, FileAccess.Read)) {
                            fileStream.CopyTo(entryStream);
                        }
                    }

                    memoryStream.Seek(0, SeekOrigin.Begin);

                    string contentType = "application/zip";
                    string fileName = "files.zip";

                    MyPDF.DeleteFile(filePath);
                    MyPDF.DeleteFile(newPdfPath);

                    return File(memoryStream.ToArray(), contentType, fileName);
                }

            }
            catch (PDFException e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null) {
                    MyPDF.DeleteFile(filePath);
                }
                if (newPdfPath != null) {
                    MyPDF.DeleteFile(newPdfPath);
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("insert-image")]
        public async Task<ActionResult> InsertImage(InsertImageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            MyImage? image = null;
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                image = new MyImage(data.imageFile, data.width, data.height);

                string newPdfPath = MyPDF.InsertImage(filePath, image, data.pageNumber, data.x, data.y);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                image.Clear();
                MyPDF.DeleteFile(filePath);

                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (image != null) {
                    image.Clear();
                }
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (image != null) {
                    image.Clear();
                }
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("rotate-pages-left")]
        public async Task<ActionResult> RotatePagesLeft(RotatePagesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.RotatePages(filePath, false);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("rotate-pages-right")]
        public async Task<ActionResult> RotatePagesRight(RotatePagesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.RotatePages(filePath, true);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("rotate-page-left")]
        public async Task<ActionResult> RotatePageLeft(RotatePageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.RotatePage(filePath, data.pageNumber, false);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("rotate-page-right")]
        public async Task<ActionResult> RotatePageRight(RotatePageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.RotatePage(filePath, data.pageNumber, true);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("add-text")]
        public async Task<ActionResult> AddText(AddTextRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.AddText(filePath, data.text, data.pageNumber, data.x, data.y, data.fontSize, data.font, data.isBold, data.isItalic, data.isUnderline, data.htmlColorCode); 

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("edit-text")]
        public async Task<ActionResult> EditText(EditTextRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.EditText(filePath, data.text, data.pageNumber, data.x, data.y, data.fontSize, data.font, data.isBold, data.isItalic, data.isUnderline, data.htmlColorCode);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("crop-page")]
        public async Task<ActionResult> CropPage(CropPageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.CropPage(filePath, data.pageNumber, data.x, data.y, data.width, data.height);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;
                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("delete-text")]
        public async Task<ActionResult> DeleteText(DeleteTextRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();
            string? filePath = null;
            bool deleteOldFile = false;

            try {
                filePath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.DeleteText(filePath, data.pageNumber, data.x1, data.y1, data.x2, data.y2);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                deleteOldFile = true;

                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(newPdfPath);

                MyPDF.DeleteFile(filePath);
                return File(fileBytes, "application/pdf", "returned.pdf");
            }
            catch (PDFException e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (filePath != null && deleteOldFile) {
                    MyPDF.DeleteFile(filePath);
                }
                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("сonvert-word-to-pdf")]
        public async Task<IActionResult> ConvertWordToPdf(WordTopPdfConvertRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            string? wordFilePath = null;
            string? pdfFilePath = null;

            try {
                wordFilePath = Path.GetTempFileName() + ".docx";
                using (var stream = new FileStream(wordFilePath, FileMode.Create)) {
                    await data.file.CopyToAsync(stream);
                }

                pdfFilePath = Path.GetTempFileName() + ".pdf";
                var (success, errorMessage) = await _wordToPdfConverter.ConvertWordToPdfAsync(wordFilePath, pdfFilePath);

                if (!success) {
                    _logger.LogError($"Conversion error: {errorMessage}");

                    MyPDF.DeleteFile(wordFilePath);
                    MyPDF.DeleteFile(pdfFilePath);

                    return StatusCode(500, $"Conversion error: {errorMessage}");
                }

                byte[] pdfBytes = System.IO.File.ReadAllBytes(pdfFilePath);
                string fileName = Path.GetFileNameWithoutExtension(data.file.FileName) + ".pdf";
                MyPDF.DeleteFile(wordFilePath);
                MyPDF.DeleteFile(pdfFilePath);

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (PDFException e) {
                if (wordFilePath != null) {
                    MyPDF.DeleteFile(wordFilePath);
                }
                if (pdfFilePath != null) {
                    MyPDF.DeleteFile(pdfFilePath);
                }

                _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
                return BadRequest(e.Message);
            }
            catch (Exception e) {
                if (wordFilePath != null) {
                    MyPDF.DeleteFile(wordFilePath);
                }
                if (pdfFilePath != null) {
                    MyPDF.DeleteFile(pdfFilePath);
                }

                _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}