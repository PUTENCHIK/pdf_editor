using Microsoft.AspNetCore.Mvc;
using PDF_API.Data;
using PDF_API.Models;
using pdf_editor.Server.Models;
using pdf_editor.Server.Requests;


namespace PDF_API.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase {
        
        private readonly ILogger<PDFController> _logger;
        private readonly AppDbContext _context;

        public PDFController(ILogger<PDFController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;

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

        [HttpPost("delete-page")]
        public ActionResult DeletePage(DeletePageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.DeletePage(pdfPath, data.pageNumber);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
                return File(fileBytes, "application/pdf", "returned.pdf");
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

        [HttpPost("swap-pages")]
        public ActionResult SwapPages(SwapPagesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.SwapPages(pdfPath, data.pageFrom, data.pageTo);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
                return File(fileBytes, "application/pdf", "returned.pdf");
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

        [HttpPost("combine-pdf-files")]
        public ActionResult CombinePdfFiles(CombinePdfFilesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            string? filePath = null;
            string? filePath2 = null;
            string? newPdfPath = null;

            try {
                MyPDF.CanBeUpload(data.file);
                filePath = MyPDF.Upload(data.file);
                MyPDF.CanBeUpload(data.file2);
                filePath2 = MyPDF.Upload(data.file);

                newPdfPath = MyPDF.CombineFiles(filePath, filePath2);


                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
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

        //[HttpPost("split-file")]
        //public ActionResult SplitFile(IFormFile fileToUpload, int breakPage) {
        //    string? requestId = HttpContext.Items["RequestId"]?.ToString();

        //    try {

        //        byte[] fileBytes = System.IO.File.ReadAllBytes(mypdf.getOutputFilePath());

        //        // Два варианта для отправки нескольких pdf файлов.
        //        // 1) zip файлом отправить.
        //        // 2) отправить пути до файла, и потом клиент несколько раз отправляет запрос.
        //        return File(fileBytes, "application/pdf", "returned.pdf");
        //    }
        //    catch (PDFException e) {
        //        if (mypdf != null) {
        //            mypdf.Clear();
        //        }

        //        _logger.LogInformation($"RequestId: {requestId}. The user received an error: {e.Message}");
        //        return BadRequest(e.Message);
        //    }
        //    catch (Exception e) {
        //        if (mypdf != null) {
        //            mypdf.Clear();
        //        }

        //        _logger.LogCritical($"RequestId: {requestId}. {e.Message}");
        //        return StatusCode(500, "Internal Server Error");
        //    }
        //}

        [HttpPost("InsertImage")]
        public ActionResult InsertImage(InsertImageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                var image = new MyImage(data.imageFile, data.width, data.height);

                string newPdfPath = MyPDF.InsertImage(pdfPath, image, data.pageNumber, data.x, data.y);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);

                return File(fileBytes, "application/pdf", "returned.pdf");
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

        [HttpPost("RotatePages")]
        public ActionResult RotatePages(RotatePagesRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.RotatePages(pdfPath, data.degrees);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
                return File(fileBytes, "application/pdf", "returned.pdf");
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

        [HttpPost("AddText")]
        public ActionResult AddText(AddTextRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.AddText(pdfPath, data.text, data.pageNumber, data.x, data.y, data.fontSize, data.font, data.isBold, data.fontColor); 

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
                return File(fileBytes, "application/pdf", "returned.pdf");
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

        [HttpPost("CropPage")]
        public ActionResult CropPage(CropPageRequest data) {
            string? requestId = HttpContext.Items["RequestId"]?.ToString();

            try {
                string pdfPath = DbPDF.GetPdfPath(_context, data.fileId);
                string newPdfPath = MyPDF.CropPage(pdfPath,data.pageNumber, data.x, data.y, data.width, data.height);

                DbPDF.UpdatePath(_context, data.fileId, newPdfPath);
                byte[] fileBytes = System.IO.File.ReadAllBytes(newPdfPath);
                return File(fileBytes, "application/pdf", "returned.pdf");
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
    }
}